"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TAGS } from '@/types/news';

interface TagsFilterProps {
  selectedTags: string[];
  onTagSelect: (tags: string[]) => void;
}

export default function TagsFilter({ selectedTags, onTagSelect }: TagsFilterProps) {
  const [showAll, setShowAll] = useState(false);
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter(t => t !== tag));
    } else {
      onTagSelect([...selectedTags, tag]);
    }
  };
  
  // Show only popular tags unless showAll is true
  const popularTags = TAGS.slice(0, 10);
  const tagsToDisplay = showAll ? TAGS : popularTags;
  
  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Filter by Tags</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAll(!showAll)}
          className="text-xs"
        >
          {showAll ? "Show Less" : "Show All"}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tagsToDisplay.map((tag) => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleTag(tag)}
            className="text-xs"
          >
            {tag.toLowerCase().replace('_', ' ')}
          </Button>
        ))}
      </div>
    </div>
  );
}
