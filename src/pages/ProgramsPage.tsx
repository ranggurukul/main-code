import React, { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { AcademySection } from '../components/AcademySection';
import { ApplicationModal } from '../components/ApplicationModal';

export const ProgramsPage: React.FC = () => {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | undefined>(undefined);

  const handleOpenApply = (programTitle?: string) => {
    setSelectedProgram(programTitle);
    setIsApplyOpen(true);
  };

  return (
    <PageTransition>
      <div className="pt-20">
        <AcademySection onOpenApply={handleOpenApply} />
      </div>

      <ApplicationModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        defaultProgram={selectedProgram}
      />
    </PageTransition>
  );
};
