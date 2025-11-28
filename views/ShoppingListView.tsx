import React from 'react';
import { ComprehensivePlan } from '../types';
import { Card } from '../components/UI';
import { CheckCircle2, Circle } from 'lucide-react';

export const ShoppingListView: React.FC<{ plan: ComprehensivePlan }> = ({ plan }) => {
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-white">Inventory</h2>
        <p className="text-slate-400">Essential supplies for your weekly protocol.</p>
      </header>

      <Card className="max-w-3xl">
        <div className="space-y-1">
          {plan.shoppingList.map((item, idx) => {
            const isChecked = checkedItems[item];
            return (
              <div 
                key={idx}
                onClick={() => toggleItem(item)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${isChecked ? 'bg-white/5 opacity-50' : 'hover:bg-white/5'}`}
              >
                {isChecked 
                  ? <CheckCircle2 className="text-neon-lime" size={24} /> 
                  : <Circle className="text-slate-600" size={24} />
                }
                <span className={`text-lg ${isChecked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
