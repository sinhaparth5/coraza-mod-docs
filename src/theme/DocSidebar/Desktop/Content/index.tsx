import React from 'react';
import DocSidebarDesktopContent from '@theme-original/DocSidebar/Desktop/Content';
import type {Props} from '@theme/DocSidebar/Desktop/Content';
import SidebarCategoryNav from '../../CategoryNav';

export default function DocSidebarDesktopContentWrapper(props: Props): React.ReactElement {
  return (
    <>
      <SidebarCategoryNav />
      <DocSidebarDesktopContent {...props} />
    </>
  );
}
