import React, { PureComponent, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import update from 'immutability-helper';
import {
  INITIALIZE_END_OF_FLOW_ROUTE,
  INITIALIZE_SEED_PHRASE_ROUTE,
} from '../../../../constants/routes';
// import {
//   EVENT,
//   EVENT_NAMES,
// } from '../../../../../shared/constants/metametrics';
import { exportAsFile } from '../../../../utils/export-utils';
import DraggableSeed from './draggable-seed.component';
import { t } from '~/utils/helper';
import { Button } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';

const EMPTY_SEEDS = Array(12).fill(null);

const ConfirmSeedPhrase = ({ seedPhrase, setSeedPhraseBackedUp }: any) => {
  const [cards, setCards] = useState<any[]>([]);
  const navigate = useNavigate();
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      }),
    );
  }, []);
  const renderCard = useCallback((card: any, index: number) => {
    return (
      <ConfirmSeedPhrase
        key={card.id}
        index={index}
        id={card.id}
        text={card.text}
        moveCard={moveCard}
      />
    );
  }, []);

  const isValid = () => {
    const selectedSeedWords = cards.map((card: any) => card.text);
    return seedPhrase === selectedSeedWords.join(' ');
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      return;
    }

    try {
      setSeedPhraseBackedUp(true).then(async () => {
        // this.context.trackEvent({
        //   category: EVENT.CATEGORIES.ONBOARDING,
        //   event: EVENT_NAMES.WALLET_CREATED,
        //   properties: {
        //     account_type: EVENT.ACCOUNT_TYPES.DEFAULT,
        //     is_backup_skipped: false,
        //   },
        // });

        navigate(INITIALIZE_END_OF_FLOW_ROUTE);
      });
    } catch (error: any) {
      console.error(error.message);
      // this.context.trackEvent({
      //   category: EVENT.CATEGORIES.ONBOARDING,
      //   event: EVENT_NAMES.WALLET_SETUP_FAILED,
      //   properties: {
      //     account_type: EVENT.ACCOUNT_TYPES.DEFAULT,
      //     is_backup_skipped: false,
      //     reason: 'Seed Phrase Creation Error',
      //     error: error.message,
      //   },
      // });
    }
  };

  return (
    <div className='confirm-seed-phrase' data-testid='confirm-seed-phrase'>
      <div className='confirm-seed-phrase__back-button'>
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate(INITIALIZE_SEED_PHRASE_ROUTE);
          }}
          href='#'
        >
          {`< ${t('back')}`}
        </a>
      </div>
      <div className='first-time-flow__header'>{t('confirmSecretBackupPhrase')}</div>
      <div className='first-time-flow__text-block'>{t('selectEachPhrase')}</div>
      <div
        className={classnames('confirm-seed-phrase__selected-seed-words', {
          'confirm-seed-phrase__selected-seed-words--dragging': 1 > -1,
        })}
      >
        <div>{cards.map((card, i) => renderCard(card, i))}</div>
      </div>
      <Button
        color='primary'
        className='first-time-flow__button'
        onClick={handleSubmit}
        disabled={!isValid()}
      >
        {t('confirm')}
      </Button>
    </div>
  );
};

export default ConfirmSeedPhrase;
