import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Plus, Trash2, Calendar, Globe, BarChart3, History, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Types
interface Task {
  id: number;
  text: string;
  type: 'daily' | 'global';
  completed: boolean;
  createdAt: string;
}

interface HistoryEntry {
  id: number;
  taskId: number;
  taskText: string;
  taskType: 'daily' | 'global';
  completedDate: string;
}

type TabType = 'home' | 'stats' | 'history';
type TaskViewType = 'daily' | 'global';

export default function DoIt() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [taskType, setTaskType] = useState<'daily' | 'global'>('daily');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [taskViewType, setTaskViewType] = useState<TaskViewType>('daily');

  const insets = useSafeAreaInsets();

  // Initialize data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      const savedHistory = await AsyncStorage.getItem('history');
      
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
      setHistory(savedHistory ? JSON.parse(savedHistory) : []);

      const lastReset = await AsyncStorage.getItem('lastReset');
      const today = new Date().toDateString();
      
      if (lastReset !== today) {
        // Reset only daily tasks to uncompleted state
        const allTasks = savedTasks ? JSON.parse(savedTasks) : [];
        const resetTasks = allTasks.map((t: Task) => 
          t.type === 'daily' ? { ...t, completed: false } : t
        );
        setTasks(resetTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(resetTasks));
        await AsyncStorage.setItem('lastReset', today);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  useEffect(() => {
    saveHistory();
  }, [history]);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem('history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Date.now(),
        text: newTask,
        type: taskType,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
      setShowAddModal(false);
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completeTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        taskId: id,
        taskText: task.text,
        taskType: task.type,
        completedDate: new Date().toISOString(),
      };
      setHistory([...history, historyEntry]);
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const deleteHistoryEntry = (id: number) => {
    setHistory(history.filter(e => e.id !== id));
  };

  const clearAllHistory = async () => {
    Alert.alert('Clear All History', 'Are you sure you want to delete all history?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Clear',
        onPress: async () => {
          setHistory([]);
          await AsyncStorage.setItem('history', JSON.stringify([]));
        },
      },
    ]);
  };

  const globalTasks = tasks.filter(t => t.type === 'global');
  const dailyTasks = tasks.filter(t => t.type === 'daily');
  const displayTasks = taskViewType === 'daily' ? dailyTasks : globalTasks;

  const completedToday = history.filter(
    h => h.completedDate.split('T')[0] === new Date().toISOString().split('T')[0]
  ).length;

  const TaskItem: React.FC<{ task: Task }> = ({ task }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#111', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#374151', marginBottom: 8 }}>
      <TouchableOpacity onPress={() => toggleTask(task.id)}>
        <View style={{ width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: '#fff', backgroundColor: task.completed ? '#fff' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {task.completed && <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>✓</Text>}
        </View>
      </TouchableOpacity>
      
      <Text style={{ flex: 1, fontSize: 14, color: task.completed ? '#999' : '#fff', textDecorationLine: task.completed ? 'line-through' : 'none' }}>
        {task.text}
      </Text>
      
      <TouchableOpacity 
        onPress={() => completeTask(task.id)}
        style={{ backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 }}
      >
        <Text style={{ color: '#000', fontSize: 12, fontWeight: '700' }}>Done</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => deleteTask(task.id)}>
        <Trash2 size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const HistoryItem: React.FC<{ entry: HistoryEntry }> = ({ entry }) => (
    <View style={{ backgroundColor: '#111', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#374151', marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>{entry.taskText}</Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {new Date(entry.completedDate).toLocaleString()}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ borderWidth: 1, borderColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
            <Text style={{ fontSize: 12, color: '#fff' }}>{entry.taskType}</Text>
          </View>
          <TouchableOpacity onPress={() => deleteHistoryEntry(entry.id)}>
            <Trash2 size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
    <StatusBar style="light" translucent />
    <View style={{ 
      flex: 1, 
      backgroundColor: '#000', 
      paddingTop: insets.top, 
      }}>
      {/* Header */}
      <View style={{ backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#fff', paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 32, fontWeight: '700', color: '#fff' }}>Do-it</Text>
          <Text style={{ color: '#d1d5db', fontSize: 12 }}>Get things done</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={{ backgroundColor: '#fff', borderRadius: 50, padding: 12 }}
        >
          <Plus size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16 }}>
        {activeTab === 'home' && (
          <>
            {/* Toggle for Daily/Global Tasks */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => setTaskViewType('daily')}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: taskViewType === 'daily' ? '#fff' : 'transparent',
                  borderWidth: taskViewType === 'daily' ? 0 : 1,
                  borderColor: '#fff'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Calendar size={18} color={taskViewType === 'daily' ? '#000' : '#fff'} />
                  <Text style={{ fontWeight: '700', color: taskViewType === 'daily' ? '#000' : '#fff' }}>Daily</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTaskViewType('global')}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: taskViewType === 'global' ? '#fff' : 'transparent',
                  borderWidth: taskViewType === 'global' ? 0 : 1,
                  borderColor: '#fff'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Globe size={18} color={taskViewType === 'global' ? '#000' : '#fff'} />
                  <Text style={{ fontWeight: '700', color: taskViewType === 'global' ? '#000' : '#fff' }}>Tasks</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Tasks List */}
            <View style={{ backgroundColor: '#000', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#fff', marginBottom: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                {taskViewType === 'daily' ? (
                  <Calendar size={18} color="#fff" />
                ) : (
                  <Globe size={18} color="#fff" />
                )}
                <Text style={{ fontWeight: '600', fontSize: 18, color: '#fff' }}>
                  {taskViewType === 'daily' ? 'Daily' : 'Tasks'} Tasks
                </Text>
                <View style={{ marginLeft: 'auto' }}>
                  <Text style={{ color: '#d1d5db', fontSize: 12 }}>{displayTasks.length}</Text>
                </View>
              </View>

              {displayTasks.length === 0 ? (
                <Text style={{ color: '#6b7280', fontSize: 12, textAlign: 'center', paddingVertical: 32 }}>
                  No {taskViewType === 'daily' ? 'daily' : ''} tasks yet. Create one to get started!
                </Text>
              ) : (
                <View>
                  {displayTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            {/* Stats Cards */}
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
              <View style={{ flex: 1, backgroundColor: '#000', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#fff', minWidth: '30%' }}>
                <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 8 }}>Total Tasks</Text>
                <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff' }}>{tasks.length}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#000', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#fff', minWidth: '30%' }}>
                <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 8 }}>Today</Text>
                <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff' }}>{completedToday}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#000', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#fff', minWidth: '30%' }}>
                <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 8 }}>Total Done</Text>
                <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff' }}>{history.length}</Text>
              </View>
            </View>

            <View style={{ backgroundColor: '#000', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#fff', marginBottom: 32 }}>
              <Text style={{ fontWeight: '600', color: '#fff', marginBottom: 12 }}>Tasks Completed (Last 7 Days)</Text>
              <View style={{ backgroundColor: '#111', padding: 16, borderRadius: 8 }}>
                {[...Array(7)].map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i));
                  const dateStr = date.toISOString().split('T')[0];
                  const count = history.filter(h => h.completedDate.split('T')[0] === dateStr).length;
                  const percentage = count > 0 ? Math.max((count / Math.max(...history.map(h => {
                    const d = new Date();
                    d.setDate(d.getDate() - 6);
                    const dStr = d.toISOString().split('T')[0];
                    return history.filter(x => x.completedDate.split('T')[0] === dStr).length;
                  }), 1)) * 100, 20) : 0;
                  return (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <Text style={{ color: '#6b7280', width: 48, fontSize: 12 }}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                      <View style={{ flex: 1, backgroundColor: '#333', borderRadius: 4, height: 24, overflow: 'hidden' }}>
                        {count > 0 && (
                          <View style={{ backgroundColor: '#fff', height: '100%', width: `${percentage}%` }} />
                        )}
                      </View>
                      <Text style={{ color: '#fff', fontWeight: '700', width: 24, textAlign: 'right' }}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {activeTab === 'history' && (
          <>
            {history.length === 0 ? (
              <Text style={{ color: '#6b7280', textAlign: 'center', paddingVertical: 32 }}>No completed tasks yet</Text>
            ) : (
              <>
                {history.slice().reverse().map(entry => (
                  <HistoryItem key={entry.id} entry={entry} />
                ))}
                <TouchableOpacity
                  onPress={clearAllHistory}
                  style={{ backgroundColor: '#fff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, marginTop: 16, marginBottom: 32 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Trash2 size={16} color="#000" />
                    <Text style={{ color: '#000', fontWeight: '700' }}>Clear All History</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={{ backgroundColor: '#000', borderTopWidth: 1, borderTopColor: '#fff', flexDirection: 'row', gap: 4, paddingHorizontal: 8, paddingVertical: 8 }}>
        <TouchableOpacity
          onPress={() => setActiveTab('home')}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: activeTab === 'home' ? '#fff' : 'transparent',
            borderWidth: activeTab === 'home' ? 0 : 1,
            borderColor: '#fff'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Calendar size={18} color={activeTab === 'home' ? '#000' : '#fff'} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('stats')}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: activeTab === 'stats' ? '#fff' : 'transparent',
            borderWidth: activeTab === 'stats' ? 0 : 1,
            borderColor: '#fff'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <BarChart3 size={18} color={activeTab === 'stats' ? '#000' : '#fff'} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: activeTab === 'history' ? '#fff' : 'transparent',
            borderWidth: activeTab === 'history' ? 0 : 1,
            borderColor: '#fff'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <History size={18} color={activeTab === 'history' ? '#000' : '#fff'} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Add Task Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#000', borderTopWidth: 1, borderTopColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff' }}>Add New Task</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <TextInput
                value={newTask}
                onChangeText={setNewTask}
                placeholder="What do you want to do?"
                placeholderTextColor="#6b7280"
                style={{ width: '100%', backgroundColor: '#000', borderWidth: 1, borderColor: '#fff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, color: '#fff', marginBottom: 16, fontSize: 16 }}
                autoFocus
              />

              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                <TouchableOpacity
                  onPress={() => setTaskType('daily')}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: taskType === 'daily' ? '#fff' : 'transparent',
                    borderWidth: taskType === 'daily' ? 0 : 1,
                    borderColor: '#fff'
                  }}
                >
                  <Text style={{ fontWeight: '700', textAlign: 'center', color: taskType === 'daily' ? '#000' : '#fff' }}>Daily</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setTaskType('global')}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: taskType === 'global' ? '#fff' : 'transparent',
                    borderWidth: taskType === 'global' ? 0 : 1,
                    borderColor: '#fff'
                  }}
                >
                  <Text style={{ fontWeight: '700', textAlign: 'center', color: taskType === 'global' ? '#000' : '#fff' }}>Task</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setShowAddModal(false)}
                  style={{ flex: 1, borderWidth: 1, borderColor: '#fff', borderRadius: 8, paddingVertical: 12 }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={addTask}
                  style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, paddingVertical: 12 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Plus size={20} color="#000" />
                    <Text style={{ color: '#000', fontWeight: '700' }}>Add</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
    </>
  );
}