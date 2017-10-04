package com.keithmackay.web;

import javax.servlet.ServletContextEvent;

/**
 * 
 * @author Keith
 *
 */
public class Listener implements javax.servlet.ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
	System.out.println("Hi!");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
	System.out.println("Bye!");
    }

}
