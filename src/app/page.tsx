'use client'

import Link from 'next/link'
import { HeaderAuth } from '@/components/HeaderAuth'

export default function Home() {
  return (
    <main className="koreaterbotec-page">
      <header className="koreaterbotec-header">
        <div className="koreaterbotec-header-inner">
          <Link href="/" className="koreaterbotec-logo">코리아터보텍</Link>
          <nav className="koreaterbotec-nav">
            <a href="#">회사소개</a>
            <a href="#">사업안내</a>
            <a href="#">제품소개</a>
          </nav>
          <HeaderAuth />
        </div>
      </header>

      <section className="koreaterbotec-hero">
        <div className="koreaterbotec-hero-image" />
        <button className="koreaterbotec-hero-arrow left">{'<'}</button>
        <button className="koreaterbotec-hero-arrow right">{'>'}</button>
      </section>

      <section className="koreaterbotec-content">
        <div className="koreaterbotec-content-inner">
          <div className="koreaterbotec-column">
            <h2 className="koreaterbotec-column-title">코리아터보텍 공지사항</h2>
            <ul className="koreaterbotec-list">
              <li>회사소개 샘플형 홈페이지가 소개 됩니다.</li>
              <li>코리아터보텍 회사소개 홈페이지는 다릅니다!</li>
              <li>새로운 홈페이지가 오픈 했습니다.</li>
              <li>차트는 코리아터보텍에서 회사소개 홈페이지에 오픈 되는...</li>
            </ul>
          </div>

          <div className="koreaterbotec-column">
            <h2 className="koreaterbotec-column-title">코리아터보텍 STORY</h2>
            <p className="koreaterbotec-story-text">
              21세기형 모바일 기반의 홈페이지 구축을 통해 경쟁사와의 차별화를 도모하고
              <br />
              더 나은 미래를 위한 홍보/마케팅을 지원합니다.
              <br />
              코리아터보텍은 디자인과 기능, 관리 효율까지 만족하지 않으면
              <br />
              절대 출시하지 않습니다.
            </p>
          </div>

          <div className="koreaterbotec-column">
            <h2 className="koreaterbotec-column-title">코리아터보텍 고객센터</h2>
            <div className="koreaterbotec-contact-info">
              <div className="koreaterbotec-phone">070-8865-2962</div>
              <div className="koreaterbotec-email">web@koreaterbotec.co.kr</div>
              <div className="koreaterbotec-time">평일 9:00 - 18:00 (주말 및 공휴일 휴무)</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="koreaterbotec-footer">
        <div className="koreaterbotec-footer-inner">
          <div className="koreaterbotec-footer-logo">코리아터보텍</div>
          <div className="koreaterbotec-footer-text">
            회사소개 | 이용약관 | 개인정보취급방침 | 고객문의
            <br />
            주소: 광주광역시 북구 첨단벤처로 77-1 광주테크노파크 402호
            <br />
            대표: 김하나 | 사업자등록번호: 851-07-00177
            <br />
            © Copyright 2016 koreaterbotec All Right Reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
