package com.mbg.service;

import com.mbg.entity.Student;
import com.mbg.entity.School;
import com.mbg.repository.StudentRepository;
import com.mbg.repository.SchoolRepository;
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
public class StudentService {

    private final StudentRepository studentRepository;
    private final SchoolRepository schoolRepository;

    @Transactional(readOnly = true)
    public Page<Student> getAllStudents(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId();
        UUID branchId = TenantContext.getBranchId();

        if (branchId != null) {
            return studentRepository.findByOrganizationIdAndBranchId(organizationId, branchId, pageable);
        } else {
            return studentRepository.findByOrganizationId(organizationId, pageable);
        }
    }

    @Transactional(readOnly = true)
    public Student getStudentById(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + id));
    }

    public Student createStudent(Student student) {
        if (student.getOrganizationId() == null) {
            student.setOrganizationId(TenantContext.getTenantId());
        }
        
        // ensure school exists and belongs to tenant
        if (student.getSchool() != null && student.getSchool().getId() != null) {
            School school = schoolRepository.findById(student.getSchool().getId())
                    .orElseThrow(() -> new EntityNotFoundException("School not found"));
            student.setSchool(school);
        } else {
            throw new IllegalArgumentException("Student must be assigned to a school");
        }

        return studentRepository.save(student);
    }

    public Student updateStudent(UUID id, Student details) {
        Student student = getStudentById(id);
        
        student.setName(details.getName());
        student.setAge(details.getAge());
        student.setGrade(details.getGrade());
        student.setParentId(details.getParentId());
        
        if (details.getSchool() != null && details.getSchool().getId() != null) {
             School school = schoolRepository.findById(details.getSchool().getId())
                    .orElseThrow(() -> new EntityNotFoundException("School not found"));
             student.setSchool(school);
        }

        return studentRepository.save(student);
    }

    public void deleteStudent(UUID id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }
}
