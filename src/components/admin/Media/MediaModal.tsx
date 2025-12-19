'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MediaItem } from '@/lib/admin/media';
import { MediaUpload } from './MediaUpload';
import { MediaBrowser } from './MediaBrowser';
interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (config: ImageConfig) => void;
  title?: string;
}

export interface ImageConfig {
  url: string;
  alt: string;
  title: string;
  alignment: 'left' | 'center' | 'right' | 'full';
  size: 'thumbnail' | 'medium' | 'large' | 'full';
  link: string;
}

export function MediaModal({ isOpen, onClose, onInsert, title = 'Insert Media' }: MediaModalProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleUploadComplete = (items: MediaItem[]) => {
    if (items.length > 0) {
      setSelectedMedia(items[0]);
      setSelectedIndex(1); // Switch to Library tab
    }
  };

  const handleInsert = (config: ImageConfig) => {
    onInsert(config);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl h-[90vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-surface px-6 py-4">
                  <Dialog.Title as="h3" className="text-xl font-bold text-secondary">
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md bg-white text-text/50 hover:text-text focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 min-h-0 flex flex-col">
                  <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex} as="div" className="flex flex-1 flex-col min-h-0">
                    <div className="flex-none border-b border-surface px-6 bg-white">
                      <Tab.List className="-mb-px flex space-x-8">
                        <Tab
                          className={({ selected }) =>
                            cn(
                              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium focus:outline-none',
                              selected
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text/60 hover:border-surface hover:text-text'
                            )
                          }
                        >
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Files
                          </div>
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            cn(
                              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium focus:outline-none',
                              selected
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text/60 hover:border-surface hover:text-text'
                            )
                          }
                        >
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Media Library
                          </div>
                        </Tab>
                      </Tab.List>
                    </div>

                    <Tab.Panels as="div" className="flex-1 min-h-0 flex flex-col">
                      <Tab.Panel as="div" className="flex-1 overflow-y-auto focus:outline-none">
                        <div className="p-6">
                          <MediaUpload onUploadComplete={handleUploadComplete} />
                        </div>
                      </Tab.Panel>
                      <Tab.Panel as="div" className="flex-1 min-h-0 flex flex-col focus:outline-none relative overflow-hidden">
                        <MediaBrowser
                          onSelect={setSelectedMedia}
                          selectedMedia={selectedMedia ? [selectedMedia.path] : []}
                          onInsert={handleInsert}
                          isModal
                        />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}