/*
 *   Copyright (c) 2023 Garmingo
 *   All rights reserved.
 *   Unauthorized use, reproduction, and distribution of this source code is strictly prohibited.
 */
import stripJsonComments from "strip-json-comments";

/**
 * Settings for the framework configuration.
 * Are loaded from framework.json
 */
export type FrameworkConfig = {
  /**
   * Whether to automatically detect the framework
   */
  AutoDetect: boolean;
  /**
   * The framework to use
   */
  Framework: "None" | "QBCore" | "ESX Legacy" | "ESX Infinity" | "Custom";
  /**
   * The event to listen to for ESX Infinity
   */
  ESXEvent: string;
  /**
   * The resource that exports the custom functions
   */
  ExportResource: string;
};

/**
 * Framework class
 * Used to interact with the framework
 */
export class Framework {
  /**
   * Local instance of the framework config
   */
  private config: FrameworkConfig;
  /**
   * Local instance of the framework object
   * This is the object that is returned by the framework
   * It is used to interact with the framework
   * It is initialized in the constructor
   * It is null if the framework is not initialized and just an empty object if 'None' or 'Custom' is selected
   * Due to the nature of the framework, this object is of type 'any' since the type is different for each framework
   */
  private framework: any;

  constructor() {
    this.config = JSON.parse(
      stripJsonComments(
        LoadResourceFile(GetCurrentResourceName(), "framework.json")
      )
    );

    if (!this.config.Framework) {
      console.log(
        "No framework selected. Please select a framework in framework.json"
      );
      return;
    }

    console.log(
      `Framework: ${this.config.Framework} is selected. AutoDetect: ${
        this.config.AutoDetect ? "Enabled" : "Disabled"
      }. Initializing...`
    );

    if (this.config.AutoDetect) {
      console.log(
        "WARNING: AutoDetect is currently not supported in this build. Please set AutoDetect to false in framework.json and select a framework manually."
      );
    }

    if (this.config.Framework === "None") {
      this.framework = {};
      return;
    }

    /* -- Initialize Framework -- */
    while (!this.framework) {
      switch (this.config.Framework) {
        case "ESX Legacy":
          this.framework = exports.es_extended.getSharedObject();
          break;
        case "ESX Infinity":
          emit(this.config.ESXEvent, (obj: any) => {
            this.framework = obj;
          });
          break;
        case "QBCore":
          this.framework = exports["qb-core"]["GetCoreObject"]();
          break;
        case "Custom":
          this.framework = {};
          break;
      }
    }
    /* -- Initialize Framework -- */
  }

  /**
   * Returns the framework config
   * @returns {FrameworkConfig} FrameworkConfig
   */
  public getConfig(): FrameworkConfig {
    return this.config;
  }

  /**
   * Checks if the framework is initialized
   * @returns {boolean} Whether the framework is initialized
   */
  public isInitialized(): boolean {
    return !!this.framework;
  }

  /**
   * Returns the raw framework object
   * This is the object that is returned by the framework
   * It is any since the type is different for each framework
   * It is null if the framework is not initialized and just an empty object if 'None' or 'Custom' is selected
   * @returns {any} Raw framework object
   */
  public getFramework(): any {
    return this.framework;
  }

  /**
   * Returns the framework name
   * It matches the FrameworkConfig.Framework exactly
   * Note: This value is case sensitive
   * @returns {string} Name of the currently selected framework
   */
  public getFrameworkName(): string {
    return this.config.Framework;
  }

  /**
   * Get the wallet money of a player
   * Note: This function only uses the default money system of the frameworks and may not work with custom money systems (for example those who utilize items as money)
   * @param player Server ID of the player
   * @returns {number} The wallet money of the player
   */
  public getPlayerWalletMoney(player: number): number {
    switch (this.config.Framework) {
      case "ESX Legacy":
        return this.framework.GetPlayerFromId(player).getMoney();
      case "ESX Infinity":
        return this.framework.GetPlayerFromId(player).getMoney();
      case "QBCore":
        return (
          this.framework.Functions.GetPlayer(player).PlayerData.money["cash"] ||
          this.framework.Functions.GetPlayer(player).PlayerData.money.cash
        );
      case "Custom":
        return exports[this.config.ExportResource].GetPlayerWalletMoney(player);
      default:
        return 0;
    }
  }

  /**
   * Get the money of a specific account of a player
   * @param player Server ID of the player
   * @param account Name of the account (e.g. bank)
   * @returns {number} Amount of money in the account
   */
  public getPlayerAccountMoney(player: number, account: string): number {
    switch (this.config.Framework) {
      case "ESX Legacy":
        return this.framework.GetPlayerFromId(player).getAccount(account);
      case "ESX Infinity":
        return (
          this.framework.GetPlayerFromId(player).getAccount(account) ||
          this.framework.GetPlayerFromId(player).GetAccountMoney(account) ||
          this.framework
            .GetPlayerFromId(player)
            .accounts.find((x: any) => x.name === account).money ||
          0
        );
      case "QBCore":
        return this.framework.Functions.GetPlayer(player).PlayerData.money[
          account
        ];
      case "Custom":
        return exports[this.config.ExportResource].GetPlayerAccountMoney(
          player,
          account
        );
      default:
        return 0;
    }
  }

  /**
   * Add money to the wallet of a player
   * Note: This function only uses the default money system of the frameworks and may not work with custom money systems (for example those who utilize items as money)
   * @param player Server ID of the player
   * @param amount Amount to add
   */
  public addPlayerWalletMoney(player: number, amount: number): void {
    switch (this.config.Framework) {
      case "ESX Legacy":
        this.framework
          .GetPlayerFromId(player)
          .addMoney(amount);
        break;
      case "ESX Infinity":
        this.framework
          .GetPlayerFromId(player)
          .addMoney(amount);
        break;
      case "QBCore":
        this.framework.Functions.GetPlayer(player).Functions.AddMoney("cash", amount);
        break;
      case "Custom":
        exports[this.config.ExportResource].AddPlayerWalletMoney(
          player,
          amount
        );
        break;
      default:
        return;
    }
  }

  /**
   * Remove money from the wallet of a player
   * Note: This function only uses the default money system of the frameworks and may not work with custom money systems (for example those who utilize items as money)
   * @param player Server ID of the player
   * @param amount Amount to remove
   */
  public removePlayerWalletMoney(player: number, amount: number): void {
    switch (this.config.Framework) {
      case "ESX Legacy":
        this.framework
          .GetPlayerFromId(player)
          .removeMoney(amount);
        break;
      case "ESX Infinity":
        this.framework
          .GetPlayerFromId(player)
          .removeMoney(amount);
        break;
      case "QBCore":
        this.framework.Functions.GetPlayer(player).Functions.RemoveMoney("cash", amount);
        break;
      case "Custom":
        exports[this.config.ExportResource].RemovePlayerWalletMoney(
          player,
          amount
        );
        break;
      default:
        return;
    }
  }

  /**
   * Add money to a specific account of a player
   * @param player Server ID of the player
   * @param account Name of the account (e.g. bank)
   * @param amount Amount to add
   */
  public addPlayerAccountMoney(player: number, account: string, amount: number): void {
    switch (this.config.Framework) {
      case "ESX Legacy":
        this.framework
          .GetPlayerFromId(player)
          .addAccountMoney(account, amount);
        break;
      case "ESX Infinity":
        this.framework
          .GetPlayerFromId(player)
          .addAccountMoney(account, amount);
        break;
      case "QBCore":
        this.framework.Functions.GetPlayer(player).Functions.AddMoney(account, amount);
        break;
      case "Custom":
        exports[this.config.ExportResource].AddPlayerAccountMoney(
          player,
          amount,
          account
        );
        break;
      default:
        return;
    }
  }

  /**
   * Remove money from a specific account of a player
   * @param player Server ID of the player
   * @param account Name of the account (e.g. bank)
   * @param amount Amount to remove
   */
  public removePlayerAccountMoney(player: number, account: string, amount: number): void {
    switch (this.config.Framework) {
      case "ESX Legacy":
        this.framework
          .GetPlayerFromId(player)
          .removeAccountMoney(account, amount);
        break;
      case "ESX Infinity":
        this.framework
          .GetPlayerFromId(player)
          .removeAccountMoney(account, amount);
        break;
      case "QBCore":
        this.framework.Functions.GetPlayer(player).Functions.RemoveMoney(account, amount);
        break;
      case "Custom":
        exports[this.config.ExportResource].RemovePlayerAccountMoney(
          player,
          amount,
          account
        );
        break;
      default:
        return;
    }
  }

  /**
   * Add an item to the inventory of a player
   * Note: This function only uses the default inventory system of the frameworks and may not work with custom inventory systems
   * @param player Server ID of the player
   * @param item Name of the item to add
   * @param amount Amount of the item to add
   */
  public addPlayerInventoryItem(player: number, item: string, amount: number): void {
    if (amount <= 0) {
      return;
    }

    switch (this.config.Framework) {
      case "ESX Legacy":
        this.framework
          .GetPlayerFromId(player)
          .addInventoryItem(item, amount);
        break;
      case "ESX Infinity":
        this.framework
          .GetPlayerFromId(player)
          .addInventoryItem(item, amount);
        break;
      case "QBCore":
        this.framework.Functions.GetPlayer(player).Functions.AddItem(item, amount);
        break;
      case "Custom":
        exports[this.config.ExportResource].AddPlayerInventoryItem(
          player,
          item,
          amount
        );
        break;
      default:
        break;
    }

    return;
  }

  /**
   * Remove an item from the inventory of a player
   * Note: This function only uses the default inventory system of the frameworks and may not work with custom inventory systems
   * @param player Server ID of the player
   * @param item Name of the item to remove
   * @param amount Amount of the item to remove
   */
  public removePlayerInventoryItem(player: number, item: string, amount: number): void {
    if (amount <= 0) {
      return;
    }

    switch (this.config.Framework) {
      case "ESX Legacy":
        this.framework
          .GetPlayerFromId(player)
          .removeInventoryItem(item, amount);
        break;
      case "ESX Infinity":
        this.framework
          .GetPlayerFromId(player)
          .removeInventoryItem(item, amount);
        break;
      case "QBCore":
        this.framework.Functions.GetPlayer(player).Functions.RemoveItem(item, amount);
        break;
      case "Custom":
        exports[this.config.ExportResource].RemovePlayerInventoryItem(
          player,
          item,
          amount
        );
        break;
      default:
        break;
    }

    return;
  }

  /**
   * Get the amount of an item in the inventory of a player
   * Returns 0 if the item is not in the inventory
   * Note: This function only uses the default inventory system of the frameworks and may not work with custom inventory systems
   * @param player Server ID of the player
   * @param item The name of the item to get the amount of
   * @returns {number} Amount of the item in the inventory
   */
  public getPlayerInventoryItemCount(player: number, item: string): number {
    switch (this.config.Framework) {
      case "ESX Legacy":
        return this.framework
          .GetPlayerFromId(player)
          .getInventoryItem(item).count;
      case "ESX Infinity":
        return this.framework
          .GetPlayerFromId(player)
          .getInventoryItem(item).count;
      case "QBCore":
        return this.framework.Functions.GetPlayer(player).Functions.GetItemByName(item).amount;
      case "Custom":
        return exports[this.config.ExportResource].GetPlayerInventoryItemCount(
          player,
          item
        );
      default:
        return 0;
    }
  }

}
