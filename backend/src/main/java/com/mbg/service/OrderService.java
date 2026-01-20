package com.mbg.service;

import com.mbg.entity.*;
import com.mbg.repository.*;
import com.mbg.config.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final SupplierRepository supplierRepository;
    private final SchoolRepository schoolRepository;
    private final MealRepository mealRepository;

    @Transactional(readOnly = true)
    public Page<Order> getAllOrders(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId();
        return orderRepository.findByOrganizationId(organizationId, pageable);
    }

    @Transactional(readOnly = true)
    public Order getOrderById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
    }

    public Order createOrder(Order order) {
        if (order.getOrganizationId() == null) {
            order.setOrganizationId(TenantContext.getTenantId());
        }
        
        // Validate dependencies
        if (order.getSupplier() != null && order.getSupplier().getId() != null) {
             Supplier supplier = supplierRepository.findById(order.getSupplier().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Supplier not found"));
             order.setSupplier(supplier);
        } else throw new IllegalArgumentException("Supplier required");

        if (order.getSchool() != null && order.getSchool().getId() != null) {
             School school = schoolRepository.findById(order.getSchool().getId())
                    .orElseThrow(() -> new EntityNotFoundException("School not found"));
             order.setSchool(school);
        } else throw new IllegalArgumentException("School required");

        if (order.getMeal() != null && order.getMeal().getId() != null) {
             Meal meal = mealRepository.findById(order.getMeal().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Meal not found"));
             order.setMeal(meal);
        } else throw new IllegalArgumentException("Meal required");
        
        // Set default status if missing
        if (order.getStatus() == null) {
            order.setStatus(Order.OrderStatus.PENDING);
        }

        return orderRepository.save(order);
    }

    public Order updateOrderStatus(UUID id, Order.OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(UUID id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }
}
