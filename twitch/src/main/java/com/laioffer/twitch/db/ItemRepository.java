package com.laioffer.twitch.db;


import com.laioffer.twitch.db.entity.ItemEntity;
import org.springframework.data.repository.ListCrudRepository;

import java.util.List;

public interface ItemRepository extends ListCrudRepository<ItemEntity, Long> {

    ItemEntity findByTwitchId(String twitchId);

    //List<ItemEntity> findAlById(List<Long> favoriteItemIds);
    //important: this is the reversed methods provided by Spring JDBK, findByXXX(click tab), no need to implement those mehods,
    //lots of other methods we don't even need to mentioned here, they are extended from ListCrudRepository, e.g deleteById

}
