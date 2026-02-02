/**
 * SKAI Usage Indicator Addon
 * Shows which components are actually used in the main app
 */

import React from 'react';
import { addons, types } from '@storybook/manager-api';
import { AddonPanel } from '@storybook/components';

// Components currently used in main app (from analysis)
const USED_COMPONENTS = new Set([
  'Alert',
  'AlertDescription', 
  'Badge',
  'Button',
  'Calendar',
  'Collapsible',
  'CollapsibleContent',
  'CollapsibleTrigger',
  'Dialog',
  'DialogContent', 
  'DialogTitle',
  'DockContainer',
  'DockIcon',
  'OnlineIndicator',
  'ParticleBackground',
  'Progress',
  'ScrollArea',
  'SimpleDockIcon',
  'Toaster',
  'TooltipProvider',
  'toast'
]);

// High-priority components that should be migrated next
const HIGH_PRIORITY = new Set([
  'Card',
  'Input', 
  'Avatar',
  'Table',
  'Tabs',
  'Select',
  'Checkbox',
  'Form',
  'PriceDisplay',
  'TokenIcon',
  'AmountInput'
]);

const ADDON_ID = 'skai-usage-indicator';

// Usage status component
const UsageIndicator = ({ componentName }: { componentName: string }) => {
  const isUsed = USED_COMPONENTS.has(componentName);
  const isHighPriority = HIGH_PRIORITY.has(componentName);
  
  if (isUsed) {
    return (
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px',
        padding: '2px 6px',
        borderRadius: '4px',
        backgroundColor: '#22c55e',
        color: 'white',
        fontSize: '10px',
        fontWeight: 'bold'
      }}>
        ✅ USED
      </div>
    );
  }
  
  if (isHighPriority) {
    return (
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px',
        padding: '2px 6px',
        borderRadius: '4px',
        backgroundColor: '#f59e0b',
        color: 'white',
        fontSize: '10px',
        fontWeight: 'bold'
      }}>
        🎯 PRIORITY
      </div>
    );
  }
  
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '4px',
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: '#6b7280',
      color: 'white',
      fontSize: '10px',
      fontWeight: 'bold'
    }}>
      💤 UNUSED
    </div>
  );
};

// Panel content
const UsagePanel = () => (
  <AddonPanel>
    <div style={{ padding: '16px', color: '#E0E0E0' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#56C0F6' }}>Component Usage Status</h3>
      
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#2DEDAD', fontSize: '14px', margin: '0 0 8px 0' }}>Legend</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <UsageIndicator componentName="Alert" />
          <span style={{ fontSize: '12px' }}>Currently used in main app</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          <UsageIndicator componentName="Card" />
          <span style={{ fontSize: '12px' }}>High priority for migration</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          <UsageIndicator componentName="SomeUnusedComponent" />
          <span style={{ fontSize: '12px' }}>Available but not used</span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ color: '#2DEDAD', fontSize: '14px', margin: '0 0 8px 0' }}>Usage Statistics</h4>
        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
          <div>✅ <strong>{USED_COMPONENTS.size}</strong> components in use</div>
          <div>🎯 <strong>{HIGH_PRIORITY.size}</strong> high-priority for migration</div>
          <div>💤 <strong>80+</strong> components available but unused</div>
          <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'rgba(86, 192, 246, 0.1)', borderRadius: '4px' }}>
            <strong>Current Utilization: ~21%</strong><br />
            <strong>Target: 90%+ utilization</strong>
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 8px 0' }}>Migration Priority</h4>
        <ol style={{ fontSize: '12px', lineHeight: '1.5', paddingLeft: '16px' }}>
          <li><strong>Week 1:</strong> Card, Input, Avatar, Table, Tabs</li>
          <li><strong>Week 2:</strong> PriceDisplay, TokenIcon, AmountInput</li>
          <li><strong>Week 3:</strong> AppShell, Layouts, Navigation</li>
          <li><strong>Week 4:</strong> OrderBook, Charts, Advanced components</li>
        </ol>
      </div>
    </div>
  </AddonPanel>
);

// Register the addon
addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: '📊 Usage',
    type: types.PANEL,
    render: ({ active }) => (active ? <UsagePanel /> : null),
  });
});

// Export for story decorators
export { USED_COMPONENTS, HIGH_PRIORITY, UsageIndicator };