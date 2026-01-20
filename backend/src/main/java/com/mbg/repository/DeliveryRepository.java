package com.mbg.repository;

import com.mbg.entity.Delivery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
    
    Page<Delivery> findByOrganizationId(UUID organizationId, Pageable pageable);
    
    // In case we want to find delivery by order
    Delivery findByOrderId(UUID orderId);
}
