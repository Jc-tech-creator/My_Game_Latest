package com.laioffer.twitch.db;

import com.laioffer.twitch.db.entity.FavoriteRecordEntity;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;


import java.util.List;


public interface FavoriteRecordRepository extends ListCrudRepository<FavoriteRecordEntity, Long> {


    List<FavoriteRecordEntity> findAllByUserId(Long userId);


    @Query("SELECT item_id FROM favorite_records WHERE user_id = :userId")
    List<Long> findFavoriteItemIdsByUserId(Long userId); // Query statement is a sql query, it is needed when there is no reserved methods, we need to implement ourselves


    @Modifying // @modifying is needed when self-implement delete, update, insert
    @Query("DELETE FROM favorite_records WHERE user_id = :userId AND item_id = :itemId")
    void delete(Long userId, Long itemId);
}




