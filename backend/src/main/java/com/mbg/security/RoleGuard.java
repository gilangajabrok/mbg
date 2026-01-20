package com.mbg.security;

import com.mbg.entity.Role;
import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.*;

/**
 * Custom annotation for role-based access control
 * Usage: @RoleGuard({Role.ADMIN, Role.SUPER_ADMIN})
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface RoleGuard {
    Role[] value();
}
