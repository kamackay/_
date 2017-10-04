package com.keithmackay.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import java.io.InputStream;
import java.io.PrintWriter;
import java.util.HashMap;

public class Controller extends CrossDomainServlet {

	private static final long serialVersionUID = 1L;

	public void request(String requestType, HashMap<String, String> params, HttpServletRequest request,
			HttpServletResponse response, HttpSession session) {
		try (PrintWriter out = response.getWriter();) {
			response.setContentType("text/json");
			String type = params.get("type");
			if (type != null) switch (type) {
				case "files":
					String ext = params.get("ext");
					String[] extensions = null;
					if (ext != null) extensions = ext.split(",");
					String[] files = getAllFiles(params.get("folder"), extensions);
					out.print(new Gson().toJson(files));
					break;
				case "verify":
					String secret = params.get("secret");
					if (!"992944".equals(secret)) response.setStatus(500);
					else {
						response.setStatus(200);
						out.print("{\"verified\":true}");
					}
					break;
				case "version":
					String version = getVersion();
					System.out.println("Version: " + version);
					out.print(new Gson().toJson(version));
					break;
			}
		} catch (Exception e) {
			handle(e);
		}
	}

	public String getVersion() throws Exception {
		StringBuilder sb = new StringBuilder();
		try (InputStream in = getServletContext().getResourceAsStream("version.txt");) {
			int c = 0;
			while ((c = in.read()) != -1)
				sb.append((char) c);
		} catch (Exception e) {
			handle(e);
		}
		return sb.toString();

	}
}
