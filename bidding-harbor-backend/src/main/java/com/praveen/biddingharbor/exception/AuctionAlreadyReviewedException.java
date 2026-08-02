package com.praveen.biddingharbor.exception;

public class AuctionAlreadyReviewedException extends RuntimeException {
    public AuctionAlreadyReviewedException(String message) {
        super(message);
    }
}
