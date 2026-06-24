export default function Footer() {
  return (
    <footer>
      <div className="wrap frow">
        <div>
          <div className="fbrand">CHS CHAOS</div>
          <small>
            A parent-led 501(c)(3) supporting Cuthbertson High School theatre
            &amp; chorus.
          </small>
        </div>
        <div style={{ textAlign: "right" }}>
          <small>
            3919 Providence Rd S, Ste. B PMB&nbsp;#215 · Waxhaw, NC 28173
            <br />
            <a
              href="mailto:info@chschaos.org"
              style={{ color: "var(--brass-soft)" }}
            >
              info@chschaos.org
            </a>
          </small>
        </div>
      </div>
    </footer>
  );
}
