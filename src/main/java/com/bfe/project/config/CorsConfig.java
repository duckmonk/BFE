package com.bfe.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 允许跨域的源
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://localhost:3001");

        config.addAllowedOrigin("http://3.107.200.79:3000");

        config.addAllowedOrigin("https://theinfinitepoint.com");
        config.addAllowedOrigin("https://www.theinfinitepoint.com");
        
        // 允许跨域的请求头
        config.addAllowedHeader("*");
        
        // 允许跨域的请求方法
        config.addAllowedMethod("*");
        
        // 允许携带cookie
        config.setAllowCredentials(true);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
} 