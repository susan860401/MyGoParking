<script setup>
import Swal from 'sweetalert2';

const reply = async () => {
  const { value: text } = await Swal.fire({
    title: '意見回復',
    html:
      '<input id="swal-input1" class="swal2-input mb-3" placeholder="輸入你的名字">' +
      '<textarea id="swal-input2" class="swal2-input form-control" style="height:300px;"" placeholder="輸入你的意見">',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const input1 = document.getElementById('swal-input1').value;
      const input2 = document.getElementById('swal-input2').value;
      if (!input1 || !input2) {
        Swal.showValidationMessage('所有欄位都必須填寫');
        return null;
      }
      return [input1, input2]; // 返回多個輸入值
    }
  });
  if (text) {
    Swal.fire(text);
  }
}


</script>

<template>
  <div>
    <!-- scroll-top button 頁面往上的button-->
    <a
      href="#"
      class="scroll-top d-flex align-items-center justify-content-center"
      ><i class="bi bi-arrow-up-short"></i
    ></a>

    <!-- ======= Footer ======= -->
    <footer id="footer" class="footer">
      <div class="footer-content position-relative">
        <div class="container">
          <div class="row">
            <div class="col-lg-1"></div>
            <div class="col-lg-4 col-md-12">
              <div class="footer-info">
                <h3>MyGO Parking</h3>
                <p>
                  801高雄市前金區中正四路211號8號樓之1<br /><br />
                  <strong>Phone:</strong> 07 969 9885<br />
                  <strong>Email:</strong> example@example.com<br />
                </p>
                <div class="social-links d-flex mt-3">
                  <a
                    href="#"
                    class="d-flex align-items-center justify-content-center"
                    ><i class="bi bi-twitter"></i
                  ></a>
                  <a
                    href="#"
                    class="d-flex align-items-center justify-content-center"
                    ><i class="bi bi-facebook"></i
                  ></a>
                  <a
                    href="#"
                    class="d-flex align-items-center justify-content-center"
                    ><i class="bi bi-instagram"></i
                  ></a>
                  <a
                    href="#"
                    class="d-flex align-items-center justify-content-center"
                    ><i class="bi bi-linkedin"></i
                  ></a>
                </div>
              </div>
            </div>
            <!-- End footer info column-->

            <div class="col-lg-2 col-md-4 footer-links">
              <h4>服務項目</h4>
              <ul>
                <li><a href="#">停車場搜尋</a></li>
                <li><a href="#">預定車位</a></li>
                <li><a href="#">月租車位</a></li>
              </ul>
            </div>
            <!-- End footer links column-->

            <div class="col-lg-2 col-md-4 footer-links">
              <h4>其他功能</h4>
              <ul>
                <li><a href="#">用戶中心</a></li>
                <li><a href="#">使用教學</a></li>
              </ul>
            </div>
            <!-- End footer links column-->

            <div class="col-lg-2 col-md-4 footer-links">
              <h4>聯絡我們</h4>
              <ul>
                <li><a href="#" @click.prevent="reply">意見回復</a></li>
                <li><a href="#">即時客服</a></li>
              </ul>
            </div>
            <!-- End footer links column-->
          </div>
        </div>
        <div class="col-lg-1"></div>
      </div>

      <div class="footer-legal text-center position-relative">
        <div class="container">
          <div class="copyright">
            &copy; Copyright <strong><span>UpConstruction</span></strong
            >. All Rights Reserved
          </div>
          <div class="credits">
            <!-- All the links in the footer should remain intact. -->
            <!-- You can delete the links only if you purchased the pro version. -->
            <!-- Licensing information: https://bootstrapmade.com/license/ -->
            <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/upconstruction-bootstrap-construction-website-template/ -->
            Designed by
            <a href="https://bootstrapmade.com/">BootstrapMade</a> Distributed
            by <a href="https://themewagon.com">ThemeWagon</a>
          </div>
          <div class="credits">
            網頁最佳體驗大小:1920x1080px
          </div>
        </div>
      </div>
    </footer>
    <!-- End Footer -->

    <!-- 意見回復 -->

  </div>
</template>

<style lang="css" scoped></style>
