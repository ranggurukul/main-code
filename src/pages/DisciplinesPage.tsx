import React, { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { DisciplinesSection } from '../components/DisciplinesSection';
import { ApplicationModal } from '../components/ApplicationModal';

export const DisciplinesPage: React.FC = () => {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | undefined>(undefined);

  const handleOpenApply = (programTitle?: string) => {
    setSelectedProgram(programTitle);
    setIsApplyOpen(true);
  };

  return (
    <PageTransition>
      <div className="pt-20">
        <DisciplinesSection onOpenApply={handleOpenApply} />
      </div>

      <ApplicationModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        defaultProgram={selectedProgram}
      />
    </PageTransition>
  );
};
