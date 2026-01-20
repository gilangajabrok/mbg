package com.mbg.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "organizations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code; // Unique organization identifier

    @Column(columnDefinition = "TEXT")
    private String description;

    private String website;

    @Column(unique = true)
    private String email;

    private String phone;
    private String address;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_type")
    @Builder.Default
    private SubscriptionType subscriptionType = SubscriptionType.BASIC;

    @Column(name = "subscription_expires_at")
    private LocalDateTime subscriptionExpiresAt;

    @Column(name = "max_branches")
    @Builder.Default
    private Integer maxBranches = 5;

    @Column(name = "max_users")
    @Builder.Default
    private Integer maxUsers = 100;

    @Column(columnDefinition = "TEXT")
    private String settings; // JSON configuration

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum SubscriptionType {
        BASIC,
        PROFESSIONAL,
        ENTERPRISE
    }
}
