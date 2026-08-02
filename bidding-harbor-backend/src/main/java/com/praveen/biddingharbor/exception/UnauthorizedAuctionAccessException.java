package com.praveen.biddingharbor.exception;

public class UnauthorizedAuctionAccessException extends RuntimeException {
    public UnauthorizedAuctionAccessException(String message) {
        super(message);
    }
}
