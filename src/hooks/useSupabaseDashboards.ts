import { useState, useEffect } from 'react';
import { Dashboard, Widget } from '../types/widget';
import { COLOR_SCHEMES } from '../types/widget';
import { WIDGET_REGISTRY } from '../widgets';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_DASHBOARD_NAME = 'Main Dashboard';

export const useSupabaseDashboards = () => {
  const { user, dashboardLimit } = useAuth();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [currentDashboardId, setCurrentDashboardId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentDashboard = dashboards.find(d => d.id === currentDashboardId) || dashboards[0];
  const scheme = currentDashboard ? (COLOR_SCHEMES[currentDashboard.colorScheme] || COLOR_SCHEMES['purple']) : COLOR_SCHEMES['purple'];

  // Load dashboards from Supabase and set up real-time subscription
  useEffect(() => {
    if (!user) return;
    
    const loadDashboards = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('dashboards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        // Convert Supabase dashboard format to local format
        const localDashboards: Dashboard[] = data.map(dbDashboard => ({
          id: dbDashboard.id,
          name: dbDashboard.name,
          widgets: Array.isArray(dbDashboard.widgets) ? (dbDashboard.widgets as unknown as Widget[]) : [],
          createdAt: new Date(dbDashboard.created_at).getTime(),
          updatedAt: new Date(dbDashboard.updated_at).getTime(),
          colorScheme: dbDashboard.color_scheme,
          locked: dbDashboard.locked || false,
          isPublic: dbDashboard.is_public
        }));

        setDashboards(localDashboards);

        // Set current dashboard or create default if none exist
        if (localDashboards.length === 0) {
          await createDefaultDashboard();
        } else {
          setCurrentDashboardId(localDashboards[0].id);
        }
      } catch (err) {
        console.error('Error loading dashboards:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboards');
      } finally {
        setLoading(false);
      }
    };

    loadDashboards();

    // Set up real-time subscription for dashboard changes
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboards',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Dashboard change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newDashboard: Dashboard = {
              id: payload.new.id,
              name: payload.new.name,
              widgets: Array.isArray(payload.new.widgets) ? (payload.new.widgets as unknown as Widget[]) : [],
              createdAt: new Date(payload.new.created_at).getTime(),
              updatedAt: new Date(payload.new.updated_at).getTime(),
              colorScheme: payload.new.color_scheme,
              locked: payload.new.locked || false,
              isPublic: payload.new.is_public
            };
            
            setDashboards(prev => [...prev, newDashboard]);
          }
          
          if (payload.eventType === 'UPDATE') {
            const updatedDashboard: Partial<Dashboard> = {
              id: payload.new.id,
              name: payload.new.name,
              widgets: Array.isArray(payload.new.widgets) ? (payload.new.widgets as unknown as Widget[]) : [],
              updatedAt: new Date(payload.new.updated_at).getTime(),
              colorScheme: payload.new.color_scheme,
              locked: payload.new.locked || false,
              isPublic: payload.new.is_public
            };
            
            setDashboards(prev => prev.map(dashboard =>
              dashboard.id === updatedDashboard.id
                ? { ...dashboard, ...updatedDashboard }
                : dashboard
            ));
          }
          
          if (payload.eventType === 'DELETE') {
            setDashboards(prev => prev.filter(dashboard => dashboard.id !== payload.old.id));
            
            // If the deleted dashboard was the current one, switch to another
            if (currentDashboardId === payload.old.id) {
              setDashboards(prev => {
                const remaining = prev.filter(d => d.id !== payload.old.id);
                if (remaining.length > 0) {
                  setCurrentDashboardId(remaining[0].id);
                }
                return remaining;
              });
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentDashboardId]);

  const createDefaultDashboard = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dashboards')
        .insert({
          user_id: user.id,
          name: DEFAULT_DASHBOARD_NAME,
          widgets: [],
          color_scheme: 'purple',
          locked: false,
          is_public: false
        })
        .select()
        .single();

      if (error) throw error;

      const newDashboard: Dashboard = {
        id: data.id,
        name: data.name,
        widgets: [],
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime(),
        colorScheme: data.color_scheme,
        locked: data.locked || false,
        isPublic: data.is_public
      };

      setDashboards([newDashboard]);
      setCurrentDashboardId(newDashboard.id);
    } catch (err) {
      console.error('Error creating default dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to create dashboard');
    }
  };

  const updateDashboardInSupabase = async (dashboardId: string, updates: Partial<Dashboard>) => {
    if (!user) return;

    try {
      const supabaseUpdates: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.widgets !== undefined) supabaseUpdates.widgets = updates.widgets;
      if (updates.colorScheme !== undefined) supabaseUpdates.color_scheme = updates.colorScheme;
      if (updates.locked !== undefined) supabaseUpdates.locked = updates.locked;
      if (updates.isPublic !== undefined) supabaseUpdates.is_public = updates.isPublic;

      const { error } = await supabase
        .from('dashboards')
        .update(supabaseUpdates)
        .eq('id', dashboardId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setDashboards(prev => prev.map(dashboard =>
        dashboard.id === dashboardId
          ? { ...dashboard, ...updates, updatedAt: Date.now() }
          : dashboard
      ));
    } catch (err) {
      console.error('Error updating dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to update dashboard');
    }
  };

  const handlePositionChange = async (id: string, position: { x: number; y: number }) => {
    if (!currentDashboard) return;

    const updatedWidgets = currentDashboard.widgets.map(widget =>
      widget.id === id ? { ...widget, position } : widget
    );

    await updateDashboardInSupabase(currentDashboard.id, { widgets: updatedWidgets });
  };

  const handleSizeChange = async (id: string, size: { width: number; height: number }) => {
    if (!currentDashboard) return;

    const updatedWidgets = currentDashboard.widgets.map(widget =>
      widget.id === id ? { ...widget, size } : widget
    );

    await updateDashboardInSupabase(currentDashboard.id, { widgets: updatedWidgets });
  };

  const handleToggleFullscreen = async (id: string) => {
    if (!currentDashboard) return;

    const updatedWidgets = currentDashboard.widgets.map(widget => {
      if (widget.id !== id) return widget;
      
      if (!widget.isFullscreen) {
        return {
          ...widget,
          isFullscreen: true,
          savedState: {
            position: { ...widget.position },
            size: { ...widget.size }
          }
        };
      } else {
        return {
          ...widget,
          isFullscreen: false,
          position: widget.savedState?.position || widget.position,
          size: widget.savedState?.size || widget.size,
          savedState: undefined
        };
      }
    });

    await updateDashboardInSupabase(currentDashboard.id, { widgets: updatedWidgets });
  };

  const handleRemoveWidget = async (id: string) => {
    if (!currentDashboard) return;

    const updatedWidgets = currentDashboard.widgets.filter(widget => widget.id !== id);
    await updateDashboardInSupabase(currentDashboard.id, { widgets: updatedWidgets });
  };

  const handleUpdateWidget = async (id: string, updates: Partial<Widget>) => {
    if (!currentDashboard) return;

    const updatedWidgets = currentDashboard.widgets.map(widget =>
      widget.id === id ? { ...widget, ...updates } : widget
    );

    await updateDashboardInSupabase(currentDashboard.id, { widgets: updatedWidgets });
  };

  const handleAddWidget = async (type: string) => {
    if (!currentDashboard) return;

    const config = WIDGET_REGISTRY[type];
    if (!config) return;

    const newWidget: Widget = {
      id: crypto.randomUUID(),
      type,
      title: config.name,
      position: { x: 20, y: 20 },
      size: config.defaultSize,
      config: {},
      enabled: true
    };

    const updatedWidgets = [...currentDashboard.widgets, newWidget];
    await updateDashboardInSupabase(currentDashboard.id, { widgets: updatedWidgets });
  };

  const handleDashboardAdd = async () => {
    if (!user) return;

    // Check tier limits
    if (dashboards.length >= dashboardLimit) {
      alert(`You've reached your dashboard limit of ${dashboardLimit}. Upgrade to premium for unlimited dashboards.`);
      return;
    }

    try {
      const newDashboardName = `Dashboard ${dashboards.length + 1}`;
      
      const { data, error } = await supabase
        .from('dashboards')
        .insert({
          user_id: user.id,
          name: newDashboardName,
          widgets: [],
          color_scheme: Object.keys(COLOR_SCHEMES)[0],
          locked: false,
          is_public: false
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes('Free users are limited')) {
          alert(error.message);
          return;
        }
        throw error;
      }

      const newDashboard: Dashboard = {
        id: data.id,
        name: data.name,
        widgets: [],
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime(),
        colorScheme: data.color_scheme,
        locked: data.locked || false,
        isPublic: data.is_public
      };

      setDashboards(prev => [...prev, newDashboard]);
      setCurrentDashboardId(newDashboard.id);
    } catch (err) {
      console.error('Error creating dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to create dashboard');
    }
  };

  const handleDashboardRename = async (dashboard: Dashboard, newName: string) => {
    await updateDashboardInSupabase(dashboard.id, { name: newName });
  };

  const handleDashboardDelete = async (dashboard: Dashboard) => {
    if (!user || dashboards.length <= 1) return;

    try {
      const { error } = await supabase
        .from('dashboards')
        .delete()
        .eq('id', dashboard.id)
        .eq('user_id', user.id);

      if (error) throw error;

      const remainingDashboards = dashboards.filter(d => d.id !== dashboard.id);
      setDashboards(remainingDashboards);
      
      if (currentDashboardId === dashboard.id) {
        setCurrentDashboardId(remainingDashboards[0]?.id || '');
      }
    } catch (err) {
      console.error('Error deleting dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete dashboard');
    }
  };

  const handleColorSchemeChange = async (newScheme: string) => {
    if (!currentDashboard || !COLOR_SCHEMES[newScheme]) return;
    
    await updateDashboardInSupabase(currentDashboard.id, { colorScheme: newScheme });
  };

  const handleToggleTabLock = async (dashboard: Dashboard) => {
    await updateDashboardInSupabase(dashboard.id, { locked: !dashboard.locked });
  };

  return {
    dashboards,
    currentDashboard,
    setCurrentDashboardId,
    scheme,
    loading,
    error,
    handlePositionChange,
    handleSizeChange,
    handleToggleFullscreen,
    handleRemoveWidget,
    handleUpdateWidget,
    handleAddWidget,
    handleDashboardAdd,
    handleDashboardRename,
    handleDashboardDelete,
    handleColorSchemeChange,
    handleToggleTabLock,
  };
}; 