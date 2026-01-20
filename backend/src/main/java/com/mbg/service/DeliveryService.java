package com.mbg.service;

import com.mbg.entity.Delivery;
import com.mbg.entity.Order;
import com.mbg.repository.DeliveryRepository;
import com.mbg.repository.OrderRepository;
import com.mbg.config.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public Page<Delivery> getAllDeliveries(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId();
        return deliveryRepository.findByOrganizationId(organizationId, pageable);
    }

    @Transactional(readOnly = true)
    public Delivery getDeliveryById(UUID id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Delivery not found with id: " + id));
    }

    public Delivery createDelivery(Delivery delivery) {
        if (delivery.getOrganizationId() == null) {
            delivery.setOrganizationId(TenantContext.getTenantId());
        }
        
        if (delivery.getOrder() != null && delivery.getOrder().getId() != null) {
            Order order = orderRepository.findById(delivery.getOrder().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Order not found"));
            delivery.setOrder(order);
        } else {
            throw new IllegalArgumentException("Order is required");
        }

        if (delivery.getStatus() == null) {
            delivery.setStatus(Delivery.DeliveryStatus.PENDING);
        }

        return deliveryRepository.save(delivery);
    }

    public Delivery updateDeliveryStatus(UUID id, Delivery.DeliveryStatus status) {
        Delivery delivery = getDeliveryById(id);
        delivery.setStatus(status);
        
        if (status == Delivery.DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(LocalDateTime.now());
            // Optionally update Order status here too
            // delivery.getOrder().setStatus(Order.OrderStatus.DELIVERED);
        }
        
        return deliveryRepository.save(delivery);
    }

    public void deleteDelivery(UUID id) {
        Delivery delivery = getDeliveryById(id);
        deliveryRepository.delete(delivery);
    }
}
