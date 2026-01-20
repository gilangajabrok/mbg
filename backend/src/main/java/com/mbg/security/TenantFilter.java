package com.mbg.security;

import com.mbg.config.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Filter to extract and set tenant context from JWT token
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TenantFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String jwt = authHeader.substring(7);
                
                try {
                    // Extract organization ID from JWT
                    String orgId = jwtTokenProvider.extractClaim(jwt, claims -> 
                        claims.get("organizationId", String.class)
                    );
                    
                    if (orgId != null) {
                        TenantContext.setTenantId(UUID.fromString(orgId));
                    }

                    // Extract branch ID if present
                    String branchId = jwtTokenProvider.extractClaim(jwt, claims ->
                        claims.get("branchId", String.class)
                    );
                    
                    if (branchId != null) {
                        TenantContext.setBranchId(UUID.fromString(branchId));
                    }
                } catch (Exception e) {
                    log.error("Failed to extract tenant context from JWT", e);
                }
            }

            filterChain.doFilter(request, response);
            
        } finally {
            // Always clear context after request
            TenantContext.clear();
        }
    }
}
