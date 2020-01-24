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

public class HomepageServlet extends CrossDomainServlet {

  private static final long serialVersionUID = 1L;

  @Override
  public void request(String requestType, HashMap<String, String> params, HttpServletRequest request,
      HttpServletResponse response, HttpSession session) {
    try (PrintWriter out = response.getWriter();) {
      String url = request.getPathInfo();
      if (url != null && url.length() > 1) {
        switch (url) {
          case "/signIn":
            break;
          case "/getData":
            response.setContentType("application/json");
            out.write(readFileToString("/META-INF/tempData/homeData.json"));
            break;
        }
      } else if ("/".equals(url)) {
        // Reply with homepage html
        response.setContentType("text/html");
        out.write(readFileToString("/META-INF/home.html"));
      } else if (url == null)
        response.sendRedirect("./");
    } catch (Exception e) {
      handle(e);
    }
  }
}
