package com.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class AppConfiguration {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // CSRF(Cross-Site Request Forgery) 보호를 비활성화
        http.csrf(csrf -> csrf.disable());
        // 애플리케이션이 OAuth2 리소스 서버로 동작하도록 설정하고, JWT를 사용한 인증을 설정
        // http.oauth2ResourceServer(configurer -> configurer.jwt(Customizer.withDefaults()));

        // 설정을 바탕으로 SecurityFilterChain 객체를 생성하여 반환
        return http.build();
    }
}
