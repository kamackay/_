package com.keithmackay.mdreader;

import java.util.Locale;

/**
 * Created by Keith MacKay on 9/1/2016.
 * Convert Markdown text to HTML text
 */
class Md2Html {
    static String convert(String markdownText) {
        StringBuilder sb = new StringBuilder("<div id='mainDiv' style='color:white;height:100vh;width:100vw;'>");
        String[] lines = markdownText.split("[\\r\\n]+");
        FormatState state = new FormatState();
        for (int i = 0; i < lines.length; i++) {
            String fLine = lines[i];
            formatting:
            {
                //TODO: Tables
                //TODO: "-------" => Line
                //TODO: Line Underlined with "=====" => <h1>
                //TODO:  Line Underlined with "-----" => <h2>
                //TODO:  "*" => strong
                //TODO:  "**" or "__" => much stronger
                //TODO:  "_" => italics
                //TODO:  "~" => strike through
                //TODO: Lists, numbered and un-numbered
                if (fLine.matches("\\s*")) {
                    break formatting;
                }
                if (fLine.matches("^=====+.*") && i > 0) {
                    lines[i - 1] = String.format(Locale.getDefault(), "<h1>%s</h1>", lines[i - 1]);
                    fLine = "";
                }
                if (fLine.matches("^#+\\s.*")) {
                    if (fLine.startsWith("# "))
                        fLine = "<h1>" + fLine.replaceAll("^#+\\s", "") + "</h1>";
                    else if (fLine.startsWith("## "))
                        fLine = "<h2>" + fLine.replaceAll("^#+\\s", "") + "</h2>";
                    else if (fLine.startsWith("### "))
                        fLine = "<h3>" + fLine.replaceAll("^#+\\s", "") + "</h3>";
                    else if (fLine.startsWith("#### "))
                        fLine = "<h4>" + fLine.replaceAll("^#+\\s", "") + "</h4>";
                    else if (fLine.startsWith("##### "))
                        fLine = "<h5>" + fLine.replaceAll("^#+\\s", "") + "</h5>";
                    else if (fLine.startsWith("###### "))
                        fLine = "<h6>" + fLine.replaceAll("^#+\\s", "") + "</h6>";
                }
                if (fLine.matches("^\\d+\\.\\s.*")) {
                    //Numbered list, like 1.
                    String[] sStr = fLine.split("\\.\\s", 2);
                    if (sStr.length == 2) {
                        if (state.ol) {
                            fLine = String.format(Locale.getDefault(), "<li>%s</li>", sStr[1]);
                        } else {
                            state.ol = true;
                            fLine = String.format(Locale.getDefault(),
                                    "<ol start='%s'><li>%s", sStr[0], sStr[1]);
                        }
                    }
                } else if (state.ol) {
                    state.ol = false;
                    fLine = "</ol>" + fLine;
                }
                if (fLine.matches("^\\s*[-⋅*+]\\s.*")) {
                    //Unordered List
                    String lineText = fLine.replaceAll("^\\s*[-⋅*+]\\s", "");
                    if (state.ul) {
                        fLine = String.format(Locale.getDefault(),
                                "<li>%s</li>", lineText);
                    } else {
                        state.ol = true;
                        fLine = String.format(Locale.getDefault(),
                                "<ul><li>%s</li>", lineText);
                    }
                } else if (state.ul) {
                    state.ul = false;
                    fLine = "</ul>" + fLine;
                }
            }
            lines[i] = fLine;
        }
        for (String t : lines) sb.append(t);
        sb.append("</div>");
        return sb.toString();
    }

    public static String convert(String markdownText, String css) {
        return convert(markdownText);
    }

    private static class FormatState {
        boolean ol, ul, code, table;

        FormatState() {
            ol = false;
            ul = false;
            code = false;
            table = false;
        }
    }
}
