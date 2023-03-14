package com.laioffer.twitch.db.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;


import java.time.Instant;

//all data class in Spring is record, this is the favorite_record table
@Table("favorite_records")
public record FavoriteRecordEntity(
        @Id Long id,//this is the PK
        Long userId,
        Long itemId,
        Instant createdAt // this is the TimeStamp type
) {
}



