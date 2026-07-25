package com.praveen.biddingharbor.entity;

import com.praveen.biddingharbor.entity.enums.AuctionEventStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "auction_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String bannerImage;

    private LocalDateTime registrationOpen;

    private LocalDateTime registrationClose;

    private LocalDateTime auctionStart;

    private LocalDateTime auctionEnd;

    @Enumerated(EnumType.STRING)
    private AuctionEventStatus status;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "event")
    private List<Auction> auctions;

}