package com.praveen.biddingharbor.dto.auction;

import com.praveen.biddingharbor.entity.enums.AuctionStatus;
import com.praveen.biddingharbor.entity.enums.AuctionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SearchAuctionRequest {

    private String keyword;

    private AuctionStatus status;

    private AuctionType type;

    private String seller;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;
}