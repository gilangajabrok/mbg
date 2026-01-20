package com.mbg.repository;

import com.mbg.entity.Student;
import com.mbg.entity.School;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {
    
    List<Student> findByParentId(UUID parentId);
    
    List<Student> findBySchool(School school);
    
    List<Student> findBySchoolId(UUID schoolId);
    
    List<Student> findByGrade(String grade);

    Page<Student> findByOrganizationId(UUID organizationId, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE s.organizationId = :organizationId AND s.school.branchId = :branchId")
    Page<Student> findByOrganizationIdAndBranchId(@Param("organizationId") UUID organizationId, @Param("branchId") UUID branchId, Pageable pageable);
}
