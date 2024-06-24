

function Header2(){
  return (
    <header>

      <nav>
        <a href="#">투데이</a>
        <a href="#">달력</a>
        <a href="#">숙소</a>
        <a href="#">메시지</a>
        <a href="#">메뉴</a>
      </nav>
    </header>
  );
}

function Welcome() {
  return (
    <section className="welcome">
      <h1>홍빈 님, 안녕하세요!</h1>
      <p>숙소 등록 후 24시간이 지나면 게스트가 숙소를 예약할 수 있습니다. 예약을 받을 수 있도록 숙소 설정을 마치보세요.</p>
      <button>숙소 등록을 완료하려면 탭하세요</button>
    </section>
  );
}

function NextSteps() {
  const steps = [
    { icon: '⚡', title: '즉시 예약 기능켜기/끄기', description: '게스트가 예약하는 방법을 선택하세요.' },
    { icon: '📅', title: '달력 설정하기', description: '예약 가능일을 업데이트 하세요.' },
    { icon: '🚫', title: '환불 정책 선택', description: '예약 취소를 관리하세요.' },
    { icon: '✅', title: '숙소 이용규칙 추가', description: '게스트에게 기대하는 바를 명확히 알려주세요.' },
    { icon: '🏷️', title: '특별 프로모션 제공', description: '할인을 추가하여 게스트의 관심을 끌어보세요.' },
    { icon: '🚪', title: '체크아웃 안내 입력하기', description: '게스트에게 문을 잠그고 나가는 방법을 알려주세요.' },
  ];

  return (
    <section className="next-steps">
      <h2>다음 단계</h2>
      <p>몇 가지 설정을 완료할 차례입니다.</p>
      <div className="steps-grid">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <span className="icon">{step.icon}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MemberHostPage() {

  return (
    <div className="App">
      <Header2 />
      <Welcome />
      <NextSteps />
    </div>
  );
}