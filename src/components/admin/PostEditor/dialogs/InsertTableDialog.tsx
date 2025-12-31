'use client';

import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { Table, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export interface InsertTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rows: number, cols: number, withHeader: boolean) => void;
}

export function InsertTableDialog({ isOpen, onClose, onConfirm }: InsertTableDialogProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeader, setWithHeader] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(rows, cols, withHeader);
    onClose();
  };

  const presets = [
    { label: '2x2', r: 2, c: 2 },
    { label: '3x3', r: 3, c: 3 },
    { label: '4x4', r: 4, c: 4 },
    { label: '5x5', r: 5, c: 5 },
  ];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-secondary/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-surface">
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle as="h3" className="text-lg font-semibold text-secondary flex items-center gap-2">
                    <Table className="h-5 w-5 text-primary" />
                    Insert Table
                  </DialogTitle>
                  <button onClick={onClose} className="text-text/50 hover:text-secondary transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="rows">Rows</Label>
                      <Input
                        id="rows"
                        type="number"
                        min="1"
                        max="20"
                        value={rows}
                        onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cols">Columns</Label>
                      <Input
                        id="cols"
                        type="number"
                        min="1"
                        max="20"
                        value={cols}
                        onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="withHeader"
                      type="checkbox"
                      checked={withHeader}
                      onChange={(e) => setWithHeader(e.target.checked)}
                      className="h-4 w-4 rounded border-surface text-primary focus:ring-primary/40"
                    />
                    <Label htmlFor="withHeader" className="cursor-pointer">Include header row</Label>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-text/50">Presets</Label>
                    <div className="flex flex-wrap gap-2">
                      {presets.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => {
                            setRows(p.r);
                            setCols(p.c);
                          }}
                          className="px-3 py-1 text-xs border border-surface rounded-md hover:border-primary hover:text-primary transition-colors"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Insert Table
                    </Button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
