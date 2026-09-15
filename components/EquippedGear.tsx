"use client";

import { useState } from "react";
import { data } from "@/lib/data";
import { MAX_EQUIPPED_PER_SLOT, type ItemSlot } from "@/lib/types";

const SLOT_LABELS: Record<ItemSlot, string> = {
  swords: "Swords",
  otherWeapons: "Other Weapons",
  firearms: "Firearms",
  subWeapons: "Sub-Weapons",
  armor: "Armor",
  headGear: "Head Gear",
  legProtection: "Leg Protection",
  cloaks: "Cloaks",
  shields: "Shields",
  accessories: "Accessories",
};

const SLOT_ORDER: ItemSlot[] = [
  "swords",
  "otherWeapons",
  "firearms",
  "subWeapons",
  "armor",
  "headGear",
  "legProtection",
  "cloaks",
  "shields",
  "accessories",
];

const itemsBySlot = SLOT_ORDER.map((slot) => ({
  slot,
  items: data.items.filter((item) => item.slot === slot),
}));

export function EquippedGear({
  characterId,
  equipped,
  itemsObtained,
  onToggleEquipped,
}: {
  characterId: string;
  equipped: Partial<Record<ItemSlot, string[]>>;
  itemsObtained: Record<string, boolean>;
  onToggleEquipped: (characterId: string, slot: ItemSlot, itemId: string) => void;
}) {
  const [openSlot, setOpenSlot] = useState<ItemSlot | null>(null);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
        Equipped Gear
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {itemsBySlot.map(({ slot, items }) => {
          const equippedIds = equipped[slot] ?? [];
          const max = MAX_EQUIPPED_PER_SLOT[slot];
          const isOpen = openSlot === slot;
          return (
            <div
              key={slot}
              className="rounded-md border border-neutral-800 bg-neutral-900/40"
            >
              <button
                onClick={() => setOpenSlot(isOpen ? null : slot)}
                className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm"
              >
                <span className="text-neutral-300">{SLOT_LABELS[slot]}</span>
                <span className="flex items-center gap-2">
                  <span className="max-w-[10rem] truncate text-xs text-neutral-500">
                    {equippedIds.length === 0
                      ? "None equipped"
                      : equippedIds
                          .map((id) => items.find((i) => i.id === id)?.name)
                          .filter(Boolean)
                          .join(", ")}
                  </span>
                  <span className="text-neutral-600">{isOpen ? "−" : "+"}</span>
                </span>
              </button>
              {isOpen && (
                <ul className="max-h-56 space-y-1 overflow-y-auto border-t border-neutral-800 p-2">
                  {items.map((item) => {
                    const isEquipped = equippedIds.includes(item.id);
                    const isFull = !isEquipped && equippedIds.length >= max;
                    const isObtained = Boolean(itemsObtained[item.id]);
                    return (
                      <li key={item.id}>
                        <label
                          className={`flex items-center gap-2 rounded px-2 py-1 text-sm ${
                            isFull
                              ? "cursor-not-allowed opacity-40"
                              : "cursor-pointer hover:bg-neutral-800/60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isEquipped}
                            disabled={isFull}
                            onChange={() => onToggleEquipped(characterId, slot, item.id)}
                            className={`size-3.5 accent-red-600 ${
                              isFull ? "" : "cursor-pointer"
                            }`}
                          />
                          <span
                            className={isObtained ? "text-neutral-300" : "text-neutral-600"}
                          >
                            {item.name}
                          </span>
                          {!isObtained && (
                            <span className="text-[10px] text-neutral-700">not obtained</span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-neutral-600">
        Most slots allow one equipped item; accessories allow two.
      </p>
    </section>
  );
}
