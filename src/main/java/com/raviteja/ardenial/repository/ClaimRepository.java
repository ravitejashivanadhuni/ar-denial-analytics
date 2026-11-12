
package com.raviteja.ardenial.repository;

import com.raviteja.ardenial.model.Claim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    @Query("""
        SELECT c.payer, SUM(c.billedAmount), COUNT(c)
        FROM Claim c
        WHERE UPPER(c.status) = 'DENIED'
        GROUP BY c.payer
        ORDER BY SUM(c.billedAmount) DESC
    """)
    List<Object[]> getDeniedAmountByPayer();

    @Query("""
        SELECT c.denialReason, SUM(c.billedAmount)
        FROM Claim c
        WHERE UPPER(c.status) = 'DENIED'
        GROUP BY c.denialReason
        ORDER BY SUM(c.billedAmount) DESC
    """)
    List<Object[]> getDeniedAmountByReason();

    @Query("""
        SELECT c FROM Claim c
        WHERE UPPER(c.status) = 'DENIED'
        AND (:payer IS NULL OR LOWER(c.payer) = LOWER(:payer))
        AND (:reason IS NULL OR LOWER(c.denialReason) = LOWER(:reason))
        AND (:startDate IS NULL OR c.deniedAt >= :startDate)
        AND (:endDate IS NULL OR c.deniedAt <= :endDate)
    """)
    Page<Claim> searchDeniedClaims(
        @Param("payer") String payer,
        @Param("reason") String reason,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
}
