package com.praveen.biddingharbor.specification;

import com.praveen.biddingharbor.dto.auction.SearchAuctionRequest;
import com.praveen.biddingharbor.entity.Auction;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class AuctionSpecification {

    public static Specification<Auction> search(
            SearchAuctionRequest request) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (request.getKeyword() != null &&
                    !request.getKeyword().isBlank()) {

                predicates.add(

                        cb.like(

                                cb.lower(root.get("title")),

                                "%" + request.getKeyword().toLowerCase() + "%"
                        )
                );
            }

            if (request.getStatus() != null) {

                predicates.add(

                        cb.equal(
                                root.get("auctionStatus"),
                                request.getStatus())
                );
            }

            if (request.getType() != null) {

                predicates.add(

                        cb.equal(
                                root.get("auctionType"),
                                request.getType())
                );
            }

            if (request.getSeller() != null &&
                    !request.getSeller().isBlank()) {

                predicates.add(

                        cb.equal(

                                root.get("seller").get("username"),

                                request.getSeller()
                        )
                );
            }

            if (request.getMinPrice() != null) {

                predicates.add(

                        cb.greaterThanOrEqualTo(

                                root.get("currentPrice"),

                                request.getMinPrice()
                        )
                );
            }

            if (request.getMaxPrice() != null) {

                predicates.add(

                        cb.lessThanOrEqualTo(

                                root.get("currentPrice"),

                                request.getMaxPrice()
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}