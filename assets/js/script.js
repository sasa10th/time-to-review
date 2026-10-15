const schedule = {
    receiptStart: "2026-10-01",
    receiptEnd: "2026-12-24",
    config: {
        action: "https://docs.google.com/forms/d/e/1FAIpQLSfBuwJSbp0_UOUv3SQKwL9mIxcAjUMsld5Se1RTXKEIOaMCsg/formResponse",
        entryName: "entry.1386556965",
        entryBody: "entry.310258904"
    }
};

const DRAFT_KEY = 'sinmungo-feedback-draft';
window.addEventListener('beforeunload', event => {
    if (sessionStorage.getItem(DRAFT_KEY)) {
        event.preventDefault();
        event.returnValue = '';
    }
});

const pad = n => String(n).padStart(2, '0');
const now = new Date(); now.setHours(0, 0, 0, 0);
const pd = s => { const [y, m, d] = s.split('-'); const dt = new Date(y, m - 1, d); dt.setHours(0, 0, 0, 0); return dt };
const ko = s => { const [y, m, d] = s.split('-'); return `${y}년 ${+m}월 ${+d}일` };

document.getElementById('todayLabel').textContent = `${now.getFullYear()}. ${pad(now.getMonth() + 1)}. ${pad(now.getDate())}`;

const receiptStart = pd(schedule.receiptStart), receiptEnd = pd(schedule.receiptEnd);
const status = now >= receiptStart && now <= receiptEnd ? 'open' : 'closed';

document.getElementById('scheduleMeta').innerHTML = `감상 접수 <strong>${ko(schedule.receiptStart)} – ${ko(schedule.receiptEnd)}</strong>`;
const pill = document.getElementById('statusPill');
pill.textContent = status === 'open' ? '감상 접수 중' : '기간 외';
pill.className = `status-pill s-${status}`;

const aside = `
<aside class="info-side">
  <div class="aside-block">
    <h3>일정 안내</h3>
    <div class="date-row"><span class="dr-key">감상 접수 시작</span><span class="dr-val">${ko(schedule.receiptStart)}</span></div>
    <div class="date-row"><span class="dr-key">감상 접수 마감</span><span class="dr-val">${ko(schedule.receiptEnd)}</span></div>
  </div>
  <div class="notice-aside">
    <h3>작성 안내</h3>
    <p>개인정보 노출에 유의하고, 공연을 보고 느낀 감상을 자유롭게 남겨주세요.</p>
  </div>
</aside>`;

const grid = document.getElementById('bodyGrid');

window.initSinmungo = function (userName) {
    if (status === 'open') {
        grid.innerHTML = `
        <div class="form-side">
          <p class="section-eyebrow">연극 감상 접수</p>
          <h2 class="section-heading">‘어른이 될 시간’을 보고<br><em>마음에 남은 이야기를 들려주세요</em></h2>
          <form id="sgForm">
            <div class="field-block">
              <label>학번과 이름을 적어주세요.</label>
              <input type="text" name="${schedule.config.entryName}" placeholder="예) 0000 홍길동"/>
            </div>
            <div class="field-block">
              <label>연극 감상</label>
              <textarea name="${schedule.config.entryBody}" maxlength="1000" id="ta" placeholder="기억에 남는 장면이나 인물, 공연을 보고 느낀 점을 자유롭게 작성해 주세요."></textarea>
              <div class="char-hint"><span id="cn">0</span> / 1000</div>
              <p class="draft-status" id="draftStatus" aria-live="polite">작성 내용은 이 탭에 임시 저장됩니다.</p>
            </div>
            <button type="submit" class="submit-btn">감상 보내기</button>
          </form>
        </div>${aside}`;

        const nameField = document.querySelector(`input[name="${schedule.config.entryName}"]`);
        const ta = document.getElementById('ta');
        const cn = document.getElementById('cn');
        const draftStatus = document.getElementById('draftStatus');
        const saveDraft = () => {
            try {
                if (nameField.value || ta.value) {
                    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
                        name: nameField.value,
                        feedback: ta.value
                    }));
                    draftStatus.textContent = '작성 내용이 이 탭에 임시 저장되었습니다.';
                } else {
                    sessionStorage.removeItem(DRAFT_KEY);
                    draftStatus.textContent = '작성 내용은 이 탭에 임시 저장됩니다.';
                }
            } catch (error) {
                draftStatus.textContent = '임시 저장에 실패했습니다. 새로고침 전에 내용을 복사해 주세요.';
                console.error('감상 임시 저장 실패:', error);
            }
        };

        try {
            const savedDraft = sessionStorage.getItem(DRAFT_KEY);
            if (savedDraft) {
                const draft = JSON.parse(savedDraft);
                if (typeof draft.name === 'string' && typeof draft.feedback === 'string') {
                    nameField.value = draft.name;
                    ta.value = draft.feedback;
                    cn.textContent = ta.value.length;
                    draftStatus.textContent = '이 탭에 임시 저장된 내용을 불러왔습니다.';
                }
            }
        } catch (error) {
            draftStatus.textContent = '임시 저장 내용을 불러오지 못했습니다.';
            console.error('감상 임시 저장 불러오기 실패:', error);
        }

        nameField.addEventListener('input', saveDraft);
        ta.addEventListener('input', () => {
            cn.textContent = ta.value.length;
            saveDraft();
        });

        document.getElementById('sgForm').addEventListener('submit', function (e) {
            e.preventDefault();
            if (!ta.value.trim()) { alert('연극 감상을 입력해주세요.'); return; }
            const receiptEndTime = pd(schedule.receiptEnd);
            receiptEndTime.setHours(23, 59, 59, 999);
            if (new Date() > receiptEndTime) { alert('감상 접수 기간이 종료되었습니다.'); return; }

            fetch(schedule.config.action, { method: 'POST', mode: 'no-cors', body: new FormData(this) })
                .then(() => {
                    try {
                        sessionStorage.removeItem(DRAFT_KEY);
                    } catch (error) {
                        console.error('제출 후 임시 저장 내용 삭제 실패:', error);
                    }
                    grid.innerHTML = `<div class="success-wrap"><h2>Thank you.</h2><p>감상이 접수되었습니다.<br>‘어른이 될 시간’을 함께 나눠주셔서 고맙습니다.</p></div>`;
                })
                .catch(() => alert('감상 제출 중 오류가 발생했습니다.'));
        });
    } else {
        grid.innerHTML = `<div class="state-msg"><div class="state-text"><h2>현재 감상 접수 기간이 아닙니다</h2><p>감상 접수 일정을 확인해 주세요.</p></div></div>${aside}`;
    }
};

if (status === 'open') {
    document.getElementById('authContainer').style.display = 'flex';
} else {
    window.initSinmungo();
}
