package com.keithmackay.web;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.api.client.extensions.appengine.http.UrlFetchTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;

public abstract class CrossDomainServlet extends HttpServlet {
	private static final long serialVersionUID = 2L;
	protected final String firebaseID = "project1-81caf";
	protected final String firebaseAPIKey = "AIzaSyBF56C6_QeivqjbXYK2p-flAb6yIAIWdR0";
	protected final String googleClientId = "1064860895382-p406vdpi0j8kd4u4c84l8bkk0apljp9q.apps.googleusercontent.com";
	protected static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
	protected static final HttpTransport HTTP_TRANSPORT = new UrlFetchTransport();

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		fixHeaders(response);
		request("POST", new RequestParser().parse(request), request, response, getSession(request));
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		fixHeaders(response);
		request("GET", new RequestParser().parse(request), request, response, getSession(request));
	}

	public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
		fixHeaders(response);
		request("PUT", new RequestParser().parse(request), request, response, getSession(request));
	}

	public void doOptions(HttpServletRequest request, HttpServletResponse response) throws IOException {
		fixHeaders(response);
		request("OPTIONS", new RequestParser().parse(request), request, response, getSession(request));
	}

	public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
		fixHeaders(response);
		request("DELETE", new RequestParser().parse(request), request, response, getSession(request));
	}

	protected void handle(Throwable e) {
		e.printStackTrace();
		System.out.println(e.getMessage());
	}

	private void fixHeaders(HttpServletResponse response) throws IOException {
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS, DELETE");
		response.addHeader("Access-Control-Allow-Headers", "Content-Type");
		response.addHeader("Access-Control-Max-Age", "86400");
	}

	private HttpSession getSession(HttpServletRequest req) {
		HttpSession session = req.getSession();
		if (session.isNew()) System.out.println("New Session");
		else {
			long age = System.currentTimeMillis() - session.getCreationTime();
			if (age >= 3600000 /* One Hour */) {
				session.invalidate();
				session = req.getSession();
				System.out.println("Recreated Session");
			} else System.out.println("Request from " + Long.toString(age) + " ms old Session.");
		}
		return session;
	}

	protected String[] getAllFiles(String folder) {
		try {
			ArrayList<String> list = new ArrayList<>();
			list = getAllFilesHelper(list, folder == null ? "/" : folder, getServletContext(), null);
			Collections.sort(list, String.CASE_INSENSITIVE_ORDER);
			return list.toArray(new String[list.size()]);
		} catch (Exception e) {
			handle(e);
			return null;
		}
	}

	protected String[] getAllFiles(String folder, String[] extens) {
		try {
			if (extens == null || extens.length == 0) return getAllFiles(folder);
			ArrayList<String> list = new ArrayList<>();
			list = getAllFilesHelper(list, folder == null ? "/" : folder, getServletContext(), extens);
			Collections.sort(list, String.CASE_INSENSITIVE_ORDER);
			return list.toArray(new String[list.size()]);
		} catch (Exception e) {
			handle(e);
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	protected ArrayList<String> getAllFilesHelper(ArrayList<String> list, String path, ServletContext context,
			String[] extens) {
		Set<String> files = context.getResourcePaths(path);
		if (files == null) return list;
		for (String file : files) {
			String lower = file.toLowerCase();
			if (file.endsWith("/")) list = getAllFilesHelper(list, file, context, extens);
			else if ((!lower.contains("web-inf") && !lower.contains("meta-inf") && !lower.contains("_secure"))
					&& (extens == null || contains(extens, file.substring(file.lastIndexOf('.') + 1, file.length()))))
				list.add(file);
		}
		return list;
	}

	private boolean contains(String[] arr, String s) {
		if (arr == null) return false;
		else if (s == null) {
			for (String a : arr)
				if (a == null) return true;
		} else for (String a : arr)
			if (a.equals(s)) return true;
		return false;
	}

	protected String readFileToString(String path) {
		StringBuilder sb = new StringBuilder();
		try (InputStream in = getServletContext().getResourceAsStream(path);) {
			int i = 0;
			while ((i = in.read()) != -1)
				sb.append((char) i);
		} catch (Exception e) {
			handle(e);
		}
		return sb.toString();
	}

	/**
	 * @author Keith MacKay
	 */
	class RequestParser {
		/**
		 * Parse a request and return the full parameter map
		 *
		 * @param request
		 *            The HTTP Request Object
		 * @param decodeVals
		 *            True to Parse Values of Key-Value Pairs assuming they are
		 *            UTF-8 Encoded
		 * @return the Key-Value Pairs given in the request
		 */
		public HashMap<String, String> parse(HttpServletRequest request, boolean decodeVals) {
			HashMap<String, String> params = new HashMap<String, String>();
			try (BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));) {
				String line;
				while ((line = br.readLine()) != null) {
					String[] s = line.split("&");
					for (String pair : s) {
						try {
							String[] kv = pair.split("=");
							if (kv.length == 2)
								params.put(kv[0], decodeVals ? URLDecoder.decode(kv[1], "UTF-8") : kv[1]);
						} catch (Exception e) {
							System.out.println("Issue in the String \"" + line + "\"");
						}
					}
				}
				if (params.size() > 0) return params;
				else {
					Enumeration<String> en = request.getParameterNames();
					while (en.hasMoreElements()) {
						String n = (String) en.nextElement();
						params.put(n, request.getParameter(n));
					}
					return params;
				}
			} catch (Exception e) {
				System.out.println(e.getMessage());
				return null;
			}
		}

		/**
		 * Parse a request and return the full parameter map
		 *
		 * @param request
		 *            The HTTP Request Object
		 * @return the Key-Value Pairs given in the request
		 */
		public HashMap<String, String> parse(HttpServletRequest request) {
			return parse(request, true);
		}
	}

	public abstract void request(String requestType, HashMap<String, String> params, HttpServletRequest request,
			HttpServletResponse response, HttpSession session);
}
