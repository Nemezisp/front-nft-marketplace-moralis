Moralis.Cloud.afterSave("ItemListed", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed transaction (item listed)");
  if (confirmed) {
    logger.info("Found Item!");
    const ActiveItem = Moralis.Object.extend("ActiveItem");

    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    query.equalTo("seller", request.object.get("seller"));
    const alreadyListedItem = await query.first();
    if (alreadyListedItem) {
      logger.info("Updating listing - destroying first");
      await alreadyListedItem.destroy();
    }

    const activeItem = new ActiveItem();
    activeItem.set("marketplaceAddress", request.object.get("address"));
    activeItem.set("nftAddress", request.object.get("nftAddress"));
    activeItem.set("price", request.object.get("price"));
    activeItem.set("tokenId", request.object.get("tokenId"));
    activeItem.set("seller", request.object.get("seller"));
    logger.info("Saving...");
    await activeItem.save();
  }
});

Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed transaction (item canceled)");
  if (confirmed) {
    logger.info("Found Item!");
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));

    const canceledItem = await query.first();
    if (canceledItem) {
      logger.info("Deleting...");
      await canceledItem.destroy();
    } else {
      logger.info("No item found");
    }
  }
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed transaction (item bought)");
  if (confirmed) {
    logger.info("Found Item!");
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));

    const boughtItem = await query.first();
    if (boughtItem) {
      logger.info("Deleting...");
      await boughtItem.destroy();
    } else {
      logger.info("No item found");
    }
  }
});
