package com.laioffer.twitch.favorite;

import com.laioffer.twitch.db.FavoriteRecordRepository;
import com.laioffer.twitch.db.ItemRepository;
import com.laioffer.twitch.db.entity.FavoriteRecordEntity;
import com.laioffer.twitch.db.entity.ItemEntity;
import com.laioffer.twitch.db.entity.UserEntity;
import com.laioffer.twitch.model.TypeGroupedItemList;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

//repository 负责连接db, 负责db基础操作
//controller负责分流， 分流给service
//service 集合了多个repository的api, 完成复杂逻辑
@Service
public class FavoriteService {
    private final ItemRepository itemRepository;
    private final FavoriteRecordRepository favoriteRecordRepository;

    public FavoriteService(ItemRepository itemRepository, FavoriteRecordRepository favoriteRecordRepository){
        this.itemRepository = itemRepository;
        this.favoriteRecordRepository = favoriteRecordRepository;
    }
    @CacheEvict(cacheNames = "recommend_items", key = "#root.args[0]")
    @Transactional
    //this annotation allow us to 保持同步，特别是删除的时候
    public void setFavoriteItem(UserEntity user, ItemEntity item){
        ItemEntity persistedItem = itemRepository.findByTwitchId(item.twitchId());
        if(persistedItem == null){// if there is no such item in item table, we have to save it first, and get am item-id
            persistedItem = itemRepository.save(item);
        }
        FavoriteRecordEntity favoriteRecord  = new FavoriteRecordEntity(null, user.id(), persistedItem.id(), Instant.now());
        favoriteRecordRepository.save(favoriteRecord);
    }



    @CacheEvict(cacheNames = "recommend_items", key = "#root.args[0]")
    public void unsetFavoriteItem(UserEntity user, String twitchId){
        ItemEntity item = itemRepository.findByTwitchId(twitchId);
        if(item != null) {// only occur when there is such item
            favoriteRecordRepository.delete(user.id(), item.id());
        }
    }

    public List<ItemEntity> getFavoriteItems(UserEntity user){
        List<Long> favoriteItemIds = favoriteRecordRepository.findFavoriteItemIdsByUserId(user.id());
        return itemRepository.findAllById(favoriteItemIds);
        //this methods is inherited from ListCrudRepository
    }

    public TypeGroupedItemList getGroupedFavoriteItems(UserEntity user){
        // get grouped favorite items, a json with three list
        List<ItemEntity> items = getFavoriteItems(user);
        return new TypeGroupedItemList(items);
    }

}
