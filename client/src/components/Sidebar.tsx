import { Tag } from '../types';

interface SidebarProps {
    tags: Tag[];
    selectedTags: string[];
    onTagSelect: (tags: string[]) => void;
}

function Sidebar({ tags, selectedTags, onTagSelect }: SidebarProps) {
  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagSelect(selectedTags.filter(tag => tag !== tagName));
    } else {
      onTagSelect([...selectedTags, tagName]);
    }
  };

    return (
        <aside className="sidebar">
        <h2 className="sidebar-title">Lists</h2>
        <ul className="sidebar-list">
          {tags.map(tag => (
            <li key={tag.id}
                onClick={() => toggleTag(tag.name)}
                className={selectedTags.includes(tag.name) ? 'selected' : ''}
            >
              {tag.name}
            </li>
          ))}
        </ul>
      </aside>
    )
}

export default Sidebar;