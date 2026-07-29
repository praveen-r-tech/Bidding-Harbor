package com.praveen.biddingharbor.entity;

import com.praveen.biddingharbor.entity.enums.AuctionSource;
import com.praveen.biddingharbor.entity.enums.AuctionStatus;
import com.praveen.biddingharbor.entity.enums.AuctionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auctions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal startingPrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal currentPrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal minimumIncrement;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuctionStatus auctionStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuctionSource auctionSource;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuctionType auctionType;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne
    @JoinColumn(name = "winner_id")
    private User winner;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private AuctionEvent event;

    @Column(nullable = false)
    private boolean approved;

    private LocalDateTime approvalDate;

    @Column(length = 500)
    private String rejectionReason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (auctionStatus == null) {
            auctionStatus = AuctionStatus.PENDING_APPROVAL;
        }

        if (auctionSource == null) {
            auctionSource = AuctionSource.COMMUNITY;
        }

        if (auctionType == null) {
            auctionType = AuctionType.OPEN;
        }

        approved = false;

        if (currentPrice == null) {
            currentPrice = startingPrice;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}