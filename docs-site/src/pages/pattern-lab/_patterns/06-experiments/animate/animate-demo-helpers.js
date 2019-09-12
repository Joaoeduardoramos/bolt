import { triggerAnims } from '@bolt/components-animate/utils';

export function enableAnimDemos() {
  function setTriggerText({ trigger, totalAnims, stage }) {
    trigger.innerText = `Trigger ${totalAnims} Animations ${stage}`;
  }

  setTimeout(() => {
    document.querySelectorAll('.demo-animate').forEach(animDemo => {
      let triggeredIn = false;
      const trigger = animDemo.querySelector('.demo-animate__trigger');
      const wrapper = animDemo.querySelector('.demo-animate__wrapper');
      let animEls = Array.from(animDemo.querySelectorAll('bolt-animate'));
      setTriggerText({ trigger, stage: 'IN', totalAnims: animEls.length });

      trigger.addEventListener('click', () => {
        animEls = Array.from(animDemo.querySelectorAll('bolt-animate'));
        const stage = triggeredIn ? 'OUT' : 'IN';
        triggerAnims({ animEls, stage, debug: false }).then(() => {
          // console.log('all done');
        });
        triggeredIn = !triggeredIn;
        setTriggerText({ trigger, stage, totalAnims: animEls.length });
      });
    });
  }, 0);
}