package com.keithmackay.web;

import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.gson.Gson;

public class RestServlet extends CrossDomainServlet {
	private static final long serialVersionUID = 3L;

	public void request(String requestType, HashMap<String, String> params, HttpServletRequest request,
			HttpServletResponse response, HttpSession session) {
		try (PrintWriter out = response.getWriter();) {
			String urlExtra = request.getPathInfo();
			if (urlExtra != null && urlExtra.length() > 1) {
				switch (urlExtra.split("/")[1].toLowerCase()) {
					case "files":
						String path = "/";
						String[] xtra = urlExtra.split("/");
						for (int i = 2; i < xtra.length; i++)
							path += (xtra[i] + "/");
						response.setContentType("text/json");
						System.out.println(path);
						String exts = params.get("ext");
						String json = new Gson().toJson(getAllFiles(path, (exts == null ? null : exts.split(","))));
						if (!params.containsKey("view")) out.print(json);
						else if ("page".equals(params.get("view"))) {
							String html = readFileToString("/META-INF/json.html").replace("##DATA##", json);
							response.setContentType("text/html");
							out.write(html);
						}
						break;
					case "db":
						if (session.isNew()) {

						} else {
							try {
								FirebaseOptions options = new FirebaseOptions.Builder()
										.setServiceAccount(
												getServletContext().getResourceAsStream("/META-INF/_secure/Webpage-c555ef431e18.json"))
										.setDatabaseUrl("https://project1-81caf.firebaseio.com/").build();
								FirebaseApp.initializeApp(options);
								DatabaseReference ref = FirebaseDatabase.getInstance().getReference("/");
								ref.addListenerForSingleValueEvent(new ValueEventListener() {
									@Override
									public void onDataChange(DataSnapshot dataSnapshot) {
										Object document = dataSnapshot.getValue();
										System.out.println(document);
									}

									@Override
									public void onCancelled(DatabaseError error) {

									}
								});
							} catch (Exception e) {
								handle(e);
							}
						}
						break;
					default:
						response.setContentType("text/plain");
						out.print("Unknown RESTful Request");
						response.setStatus(400);
						response.sendRedirect("http://keithmackay.com/rest/");
						break;
				}
			} else {
				// Show the user the info about the restful Servlet
				response.setContentType("text/html");
				out.print(readFileToString("/META-INF/rest.html"));
			}
		} catch (Exception e) {
			handle(e);
		}
	}
}
