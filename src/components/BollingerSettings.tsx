// components/BollingerSettings.tsx
// ----------------------------------------------------------
// Settings Dialog for Bollinger Bands
// - Uses shadcn/ui components (Dialog, Tabs, Input, Switch, Slider, Select)
// - Two tabs: Inputs & Style
// - Updates parent state on every change
// - Now includes line width + dashed toggle controls for each band.
// ----------------------------------------------------------

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bbOptions: any;
  setBbOptions: (opts: any) => void;
}

export default function BollingerSettings({
  open,
  onOpenChange,
  bbOptions,
  setBbOptions,
}: Props) {
  const update = (path: string[], value: any) => {
    setBbOptions((prev: any) => {
      const copy = structuredClone(prev);
      let obj: any = copy;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return copy;
    });
  };

  const renderLineControls = (label: string, key: string) => (
    <div className="space-y-2 border p-2 rounded-md">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <Switch
          checked={bbOptions.style[key].visible}
          onCheckedChange={(v) => update(["style", key, "visible"], v)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={bbOptions.style[key].color}
          onChange={(e) => update(["style", key, "color"], e.target.value)}
        />
        <Input
          type="number"
          className="w-20"
          min={1}
          max={5}
          value={bbOptions.style[key].width}
          onChange={(e) =>
            update(["style", key, "width"], Number(e.target.value))
          }
        />
        <Label>Dashed</Label>
        <Switch
          checked={bbOptions.style[key].dashed}
          onCheckedChange={(v) => update(["style", key, "dashed"], v)}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bollinger Bands Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="inputs">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-4 mt-4">
            <div>
              <Label>Length</Label>
              <Input
                type="number"
                value={bbOptions.length}
                onChange={(e) => update(["length"], Number(e.target.value))}
              />
            </div>

            <div>
              <Label>MA Type</Label>
              <Select
                value={bbOptions.maType}
                onValueChange={(v) => update(["maType"], v)}
              >
                <SelectTrigger>{bbOptions.maType}</SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMA">SMA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>StdDev Multiplier</Label>
              <Input
                type="number"
                step="0.1"
                value={bbOptions.multiplier}
                onChange={(e) => update(["multiplier"], Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Offset</Label>
              <Input
                type="number"
                value={bbOptions.offset}
                onChange={(e) => update(["offset"], Number(e.target.value))}
              />
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-6 mt-4">
            {renderLineControls("Basis (Middle Band)", "basis")}
            {renderLineControls("Upper Band", "upper")}
            {renderLineControls("Lower Band", "lower")}

            <div className="space-y-2 border p-2 rounded-md">
              <div className="flex justify-between items-center">
                <Label>Background Fill</Label>
                <Switch
                  checked={bbOptions.style.background.visible}
                  onCheckedChange={(v) =>
                    update(["style", "background", "visible"], v)
                  }
                />
              </div>
              <Label>Opacity</Label>
              <Slider
                value={[bbOptions.style.background.opacity]}
                max={1}
                step={0.05}
                onValueChange={(v) =>
                  update(["style", "background", "opacity"], v[0])
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
