package com.laioffer.twitch.item;

import com.laioffer.twitch.model.TypeGroupedItemList;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ItemController {
    //this flow is: ItemController --> itemService --> TypeGroupedItemList(it involves the ItemEntity record)
    private final ItemService itemService;

    public ItemController(ItemService itemService){//dependency injection
        this.itemService = itemService;
    }
    @GetMapping("/search") // this is a GET request, given a game_id, return the TypeGroupedItemList
    public TypeGroupedItemList search(@RequestParam("game_id") String gameId){
        return itemService.getItems(gameId);
    }

}

