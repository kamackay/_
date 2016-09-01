package sample;

import javafx.application.Application;
import javafx.concurrent.Task;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.geometry.Rectangle2D;
import javafx.scene.Scene;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.GridPane;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.FileChooser;
import javafx.stage.Screen;
import javafx.stage.Stage;

import java.io.File;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Scanner;

public class Main extends Application {
    private final WebView browser = new WebView();

    /*
     * TODO:
         * Tables
         * "-------" => Line
         * Line Underlined with "=====" => <h1>
         * Line Underlined with "-----" => <h2>
         * "*" => strong
         * "**" or "__" => much stronger
         * "_" => italics
         * "~" => strike through
         * Lists, numbered and un-numbered
     */
    @Override
    public void start(Stage primaryStage) throws Exception {
        GridPane grid = new GridPane();
        GridPane topBar = new GridPane();
        primaryStage.setTitle("Markdown Reader");
        grid.setStyle("-fx-background-color: #444444;");
        grid.setPrefSize(Double.MAX_VALUE, Double.MAX_VALUE);
        topBar.setStyle("-fx-background-color: #ffffff;");
        for (GridPane currGrid : new GridPane[]{grid, topBar}) {
            currGrid.setAlignment(Pos.CENTER);
            currGrid.setHgap(0);
            currGrid.setVgap(0);
            currGrid.setPadding(new Insets(0, 0, 0, 0));
        }
        topBar.setPrefHeight(20);
        updateHtml("<h1>Press ctrl+O to open a file</h1>");
        primaryStage.widthProperty().addListener((observable, oldValue, newValue) -> {
            final double width = newValue.doubleValue();
            browser.setPrefWidth(width * .9);
            topBar.setPrefWidth(width);
        });
        primaryStage.heightProperty().addListener((observale, oldValue, newValue) -> browser.setPrefHeight(newValue.doubleValue() * .9));
        grid.add(topBar, 0, 0);
        grid.add(browser, 0, 1);
        grid.setOnKeyPressed(event -> {
            if (event.isControlDown() && event.getCode() == KeyCode.O) openFile(primaryStage);
        });
        Rectangle2D screenBounds = Screen.getPrimary().getVisualBounds();
        primaryStage.setScene(new Scene(grid,
                (int) (screenBounds.getHeight() * .75), screenBounds.getWidth() * .4));
        primaryStage.show();
        try {
            ArrayList<String> args = new ArrayList<>();
            args.add("C:\\Documents\\Google Drive\\School\\Computer Graphics\\notes\\ray-casting-notes.md");
            args.addAll(getParameters().getRaw());
            for (String arg : args)
                if (arg.toLowerCase().endsWith(".md") && new File(arg).exists()) {
                    loadFile(arg);
                    break;
                }
        } catch (Exception e) {
            updateHtml(e.getMessage());
        }
    }

    private void openFile(Stage stage) {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Open Markdown File");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("Markdown Files", "*.md"));
        File selectedFile = fileChooser.showOpenDialog(stage);
        if (selectedFile != null) loadFile(selectedFile);
    }

    private void loadFile(String filename) {
        loadFile(new File(filename));
    }

    private void loadFile(File file) {
        if (file.canRead()) {
            try {
                String fileCont = new Scanner(file).useDelimiter("\\Z").next();
                ConversionTask task = new ConversionTask(fileCont);
                task.setOnSucceeded(event -> {
                    String str = (String) event.getSource().getValue();
                    updateHtml(str);
                });
                new Thread(task).start();
            } catch (Exception e) {
                updateHtml("Error: " + e.getMessage());
            }
        }
    }

    private class ConversionTask extends Task<String> {
        private final String markdownString;

        ConversionTask(final String markdownContents) {
            markdownString = markdownContents;
        }

        @Override
        protected String call() throws Exception {
            StringBuilder sb = new StringBuilder("<div id='mainDiv' style='color:white;height:100vh;width:100vw;'>");
            String[] lines = markdownString.split("[\\r\\n]+");
            FormatState state = new FormatState();
            for (int i = 0; i < lines.length; i++) {
                String fLine = lines[i];
                formatting:
                {
                    if (fLine.matches("\\s*")){
                        break formatting;
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
                    } else if (state.ol){
                        state.ol = false;
                        fLine = "</ol>" + fLine;
                    }
                    if (fLine.matches("^\\s*[-⋅*+]\\s.*")){
                        //Unordered List
                        String lineText = fLine.replaceAll("^\\s*[-⋅*+]\\s", "");
                        if (state.ul){
                            fLine = String.format(Locale.getDefault(),
                                    "<li>%s</li>", lineText);
                        } else {
                            state.ol = true;
                            fLine = String.format(Locale.getDefault(),
                                    "<ul><li>%s</li>", lineText);
                        }
                    } else if (state.ul){
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
    }

    private class FormatState {
        public boolean ol, ul, code, table;

        public FormatState() {
            ol = false;
            ul = false;
            code = false;table = false;
        }
    }

    private void updateHtml(final String contents) {
        WebEngine engine = browser.getEngine();
        engine.loadContent(asHtml(contents));
    }

    private String asHtml(String content) {
        final String htmlStart = "<!DOCTYPE html><html><head>" +
                "<style>body{background-color:#444444} *{color:white}</style>" +
                "</head><body>";
        return String.format(Locale.getDefault(),
                "%s%s</body></html>", htmlStart, content);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
