"use client";

import { useState } from "react";
import type { VisibilityType } from "@/components/chat/visibility-selector";

export function useChatVisibility({
  initialVisibilityType,
}: {
  chatId: string;
  initialVisibilityType: VisibilityType;
}) {
  const [visibilityType, setVisibilityType] = useState<VisibilityType>(
    initialVisibilityType
  );

  return { visibilityType, setVisibilityType };
}
