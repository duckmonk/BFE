package com.bfe.project.service;

import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.net.HttpURLConnection;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;

@Service
public class AwsService {
    
    public byte[] downloadFile(String fileUrl) throws IOException {
        try {
            // 创建信任所有证书的TrustManager
            TrustManager[] trustAllCerts = new TrustManager[] {
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() { return null; }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) { }
                    public void checkServerTrusted(X509Certificate[] certs, String authType) { }
                }
            };

            // 创建SSLContext并初始化
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());

            // 设置默认的SSLSocketFactory
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            // 创建连接
            URL url = new URL(fileUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                try (java.io.InputStream inputStream = connection.getInputStream()) {
                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                    }
                }
                return outputStream.toByteArray();
            } finally {
                connection.disconnect();
            }
        } catch (Exception e) {
            throw new IOException("Failed to download file: " + e.getMessage(), e);
        }
    }
} 