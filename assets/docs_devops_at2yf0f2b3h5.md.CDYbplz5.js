import{_ as n,a,o as l,a3 as p}from"./chunks/framework.dRMRuUHH.js";const b=JSON.parse('{"title":"使用kubeadm部署单控制节点","description":"","frontmatter":{"id":3,"title":"使用kubeadm部署单控制节点","createTime":"2023-09-06 06:08:10","category":"devops"},"headers":[],"relativePath":"docs/devops/at2yf0f2b3h5.md","filePath":"docs/devops/00202_deploy_sa_k8s_use_kubeadm.md"}'),e={name:"docs/devops/at2yf0f2b3h5.md"};function o(r,s,c,t,F,i){return l(),a("div",null,[...s[0]||(s[0]=[p(`<h2 id="须知" tabindex="-1">须知 <a class="header-anchor" href="#须知" aria-label="Permalink to “须知”">​</a></h2><div class="tip custom-block"><p class="custom-block-title custom-block-title-default">TIP</p><p>本示中例搭建的环境为单控制器节点, 不建议用于生产环境</p></div><ul><li>操作系统 <code>CentOS Linux release 7.9.2009</code></li><li>容器运行时 <code>docker version: 18.09.9</code></li><li><code>kubernetes</code>组件版本 <ul><li><code>kubeadm veresion: 1.18.9</code></li><li><code>kubelet veresion: 1.18.9</code></li><li><code>kubectl veresion: 1.18.9</code></li></ul></li><li>网络插件 <code>calico version: 3.8.4</code></li></ul><h2 id="准备工作" tabindex="-1">准备工作 <a class="header-anchor" href="#准备工作" aria-label="Permalink to “准备工作”">​</a></h2><table tabindex="0"><thead><tr><th>host</th><th>ip</th><th>role</th><th>resource</th></tr></thead><tbody><tr><td>harbor</td><td>192.168.10.10</td><td>registy</td><td>2c/2g</td></tr><tr><td>node01</td><td>192.168.10.101</td><td>master</td><td>2c/4g</td></tr><tr><td>node02</td><td>192.168.10.102</td><td>worker</td><td>2c/4g</td></tr><tr><td>node03</td><td>192.168.10.103</td><td>worker</td><td>2c/4g</td></tr></tbody></table><h2 id="部署kubernetes环境" tabindex="-1">部署kubernetes环境 <a class="header-anchor" href="#部署kubernetes环境" aria-label="Permalink to “部署kubernetes环境”">​</a></h2><h3 id="基础环境配置" tabindex="-1">基础环境配置 <a class="header-anchor" href="#基础环境配置" aria-label="Permalink to “基础环境配置”">​</a></h3><p>👉<a href="/vdocs/docs/linux/at2yf0f2b3z4.html">如何配置网络yum源</a></p><p>执行脚本初始化环境</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">./init_all.sh</span><span style="color:#E6DB74;"> node01</span></span>
<span class="line"><span style="color:#A6E22E;">./init_all.sh</span><span style="color:#E6DB74;"> node02</span></span>
<span class="line"><span style="color:#A6E22E;">./init_all.sh</span><span style="color:#E6DB74;"> node03</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>脚本内容</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#88846F;">#!/bin/bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> [[ </span><span style="color:#F92672;">-z</span><span style="color:#FD971F;font-style:italic;"> $1</span><span style="color:#F8F8F2;"> ]]; </span><span style="color:#F92672;">then</span></span>
<span class="line"><span style="color:#66D9EF;">	echo</span><span style="color:#AE81FF;"> -e</span><span style="color:#E6DB74;"> &quot;\\033[31m$(</span><span style="color:#A6E22E;">date</span><span style="color:#E6DB74;"> +&#39;%Y-%m-%d %T&#39;) [ERROR] Usage </span><span style="color:#FD971F;font-style:italic;">\${0}</span><span style="color:#E6DB74;"> &lt;hostname&gt;\\033[0m&quot;</span></span>
<span class="line"><span style="color:#66D9EF;">	exit</span><span style="color:#AE81FF;"> -1</span></span>
<span class="line"><span style="color:#F92672;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">HOSTNAME</span><span style="color:#F92672;">=</span><span style="color:#FD971F;font-style:italic;">\${1}</span></span>
<span class="line highlighted"><span style="color:#F8F8F2;">DOCKER_VERSION</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">&quot;18.09.9&quot;</span></span>
<span class="line highlighted"><span style="color:#F8F8F2;">K8S_VERSION</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">&quot;1.18.9&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 1.修改hostname</span></span>
<span class="line"><span style="color:#A6E22E;">hostnamectl</span><span style="color:#E6DB74;"> set-hostname</span><span style="color:#F8F8F2;"> \${HOSTNAME}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 2.配置hosts文件</span></span>
<span class="line"><span style="color:#A6E22E;">cat</span><span style="color:#F92672;"> &gt;&gt;</span><span style="color:#E6DB74;"> /etc/hosts</span><span style="color:#F92672;"> &lt;&lt;</span><span style="color:#F8F8F2;"> EOF</span></span>
<span class="line highlighted"><span style="color:#E6DB74;">192.168.10.10 harbor.example.com</span></span>
<span class="line highlighted"><span style="color:#E6DB74;">192.168.10.101 node01</span></span>
<span class="line highlighted"><span style="color:#E6DB74;">192.168.10.102 node02</span></span>
<span class="line highlighted"><span style="color:#E6DB74;">192.168.10.103 node03</span></span>
<span class="line"><span style="color:#F8F8F2;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 3.关闭selinux</span></span>
<span class="line"><span style="color:#A6E22E;">setenforce</span><span style="color:#AE81FF;"> 0</span></span>
<span class="line"><span style="color:#A6E22E;">sed</span><span style="color:#AE81FF;"> -i</span><span style="color:#E6DB74;"> &#39;s/^SELINUX=enforcing$/SELINUX=disabled/&#39;</span><span style="color:#E6DB74;"> /etc/selinux/config</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 4.关闭防火墙</span></span>
<span class="line"><span style="color:#A6E22E;">systemctl</span><span style="color:#E6DB74;"> stop</span><span style="color:#E6DB74;"> firewalld</span><span style="color:#F8F8F2;"> &amp;&amp; </span><span style="color:#A6E22E;">systemctl</span><span style="color:#E6DB74;"> disable</span><span style="color:#E6DB74;"> firewalld</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 5.关闭交换分区</span></span>
<span class="line"><span style="color:#A6E22E;">swapoff</span><span style="color:#AE81FF;"> -a</span></span>
<span class="line"><span style="color:#A6E22E;">sed</span><span style="color:#AE81FF;"> -ri</span><span style="color:#E6DB74;"> &#39;s/.*swap.*/#&amp;/&#39;</span><span style="color:#E6DB74;"> /etc/fstab</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 6.内核参数配置</span></span>
<span class="line"><span style="color:#A6E22E;">cat</span><span style="color:#F92672;"> &gt;&gt;</span><span style="color:#E6DB74;"> /etc/sysctl.conf</span><span style="color:#F92672;"> &lt;&lt;</span><span style="color:#F8F8F2;"> EOF</span></span>
<span class="line"><span style="color:#E6DB74;">net.bridge.bridge-nf-call-ip6tables = 1</span></span>
<span class="line"><span style="color:#E6DB74;">net.bridge.bridge-nf-call-iptables = 1</span></span>
<span class="line"><span style="color:#E6DB74;">net.ipv4.ip_forward = 1</span></span>
<span class="line"><span style="color:#E6DB74;">vm.swappiness=0</span></span>
<span class="line"><span style="color:#F8F8F2;">EOF</span></span>
<span class="line"><span style="color:#A6E22E;">modprobe</span><span style="color:#E6DB74;"> br_netfilter</span></span>
<span class="line"><span style="color:#A6E22E;">sysctl</span><span style="color:#AE81FF;"> -p</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 7.安装指定版本基础组件</span></span>
<span class="line"><span style="color:#A6E22E;">yum</span><span style="color:#E6DB74;"> install</span><span style="color:#AE81FF;"> -y</span><span style="color:#E6DB74;"> vim</span><span style="color:#E6DB74;"> bash-completion</span><span style="color:#E6DB74;"> docker-ce-</span><span style="color:#F8F8F2;">\${DOCKER_VERSION} </span><span style="color:#E6DB74;">docker-ce-</span><span style="color:#F8F8F2;">\${DOCKER_VERSION} </span><span style="color:#E6DB74;">kubeadm-</span><span style="color:#F8F8F2;">\${K8S_VERSION} </span><span style="color:#E6DB74;">kubelet-</span><span style="color:#F8F8F2;">\${K8S_VERSION} </span><span style="color:#E6DB74;">kubectl-</span><span style="color:#F8F8F2;">\${K8S_VERSION}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 8.配置daemon.json</span></span>
<span class="line"><span style="color:#A6E22E;">mkdir</span><span style="color:#E6DB74;"> /etc/docker</span></span>
<span class="line"><span style="color:#A6E22E;">cat</span><span style="color:#F92672;"> &gt;</span><span style="color:#E6DB74;"> /etc/docker/daemon.json</span><span style="color:#F92672;"> &lt;&lt;</span><span style="color:#F8F8F2;"> EOF</span></span>
<span class="line"><span style="color:#E6DB74;">{</span></span>
<span class="line"><span style="color:#E6DB74;">    &quot;exec-opts&quot;: [</span></span>
<span class="line"><span style="color:#E6DB74;">        &quot;native.cgroupdriver=systemd&quot;</span></span>
<span class="line"><span style="color:#E6DB74;">    ],</span></span>
<span class="line highlighted"><span style="color:#E6DB74;">    &quot;insecure-registries&quot;: [</span></span>
<span class="line highlighted"><span style="color:#E6DB74;">        &quot;https://harbor.example.com&quot;</span></span>
<span class="line highlighted"><span style="color:#E6DB74;">    ],</span></span>
<span class="line"><span style="color:#E6DB74;">    &quot;log-driver&quot;: &quot;json-file&quot;,</span></span>
<span class="line"><span style="color:#E6DB74;">    &quot;log-opts&quot;: {</span></span>
<span class="line"><span style="color:#E6DB74;">        &quot;max-file&quot;: &quot;3&quot;,</span></span>
<span class="line"><span style="color:#E6DB74;">        &quot;max-size&quot;: &quot;100m&quot;</span></span>
<span class="line"><span style="color:#E6DB74;">    },</span></span>
<span class="line"><span style="color:#E6DB74;">    &quot;storage-driver&quot;: &quot;overlay2&quot;</span></span>
<span class="line"><span style="color:#E6DB74;">}</span></span>
<span class="line"><span style="color:#F8F8F2;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 9.启动docker，配置docker和kubelet开机自启</span></span>
<span class="line"><span style="color:#A6E22E;">systemctl</span><span style="color:#E6DB74;"> enable</span><span style="color:#E6DB74;"> docker</span><span style="color:#E6DB74;"> kubelet</span><span style="color:#F8F8F2;"> &amp;&amp; </span><span style="color:#A6E22E;">systemctl</span><span style="color:#E6DB74;"> start</span><span style="color:#E6DB74;"> docker</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 10.配置命令后自动补齐</span></span>
<span class="line"><span style="color:#66D9EF;">echo</span><span style="color:#E6DB74;"> &#39;source &lt;(kubectl completion bash)&#39;</span><span style="color:#F92672;"> &gt;&gt;</span><span style="color:#E6DB74;">~/.bashrc</span></span>
<span class="line"><span style="color:#66D9EF;">source</span><span style="color:#E6DB74;"> ~/.bashrc</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br></div></div><h3 id="安装master节点" tabindex="-1">安装master节点 <a class="header-anchor" href="#安装master节点" aria-label="Permalink to “安装master节点”">​</a></h3><p>step01 命令行初始化集群</p><p>注：此处用的是本地镜像仓库，阿里的镜像仓库地址为<code>registry.aliyuncs.com/google_containers</code></p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">kubeadm</span><span style="color:#E6DB74;"> init</span><span style="color:#AE81FF;"> --apiserver-advertise-address</span><span style="color:#AE81FF;"> 192.168.10.101</span><span style="color:#AE81FF;">  --image-repository</span><span style="color:#E6DB74;"> harbor.example.com/google_containers</span><span style="color:#AE81FF;"> --kubernetes-version</span><span style="color:#E6DB74;"> v1.18.9</span><span style="color:#AE81FF;"> --service-cidr=10.96.0.0/12</span><span style="color:#AE81FF;"> --pod-network-cidr=172.16.0.0/16</span><span style="color:#F92672;"> |</span><span style="color:#A6E22E;"> tee</span><span style="color:#E6DB74;"> kubeadm_init.log</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>⚡查看默认镜像</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">kubeadm</span><span style="color:#E6DB74;"> config</span><span style="color:#E6DB74;"> images</span><span style="color:#E6DB74;"> list</span><span style="color:#AE81FF;"> --kubernetes-version</span><span style="color:#E6DB74;"> v1.18.9</span><span style="color:#AE81FF;"> --image-repository</span><span style="color:#E6DB74;"> registry.aliyuncs.com/google_containers</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>step02 配置客户端访问集群</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">mkdir</span><span style="color:#AE81FF;"> -p</span><span style="color:#F8F8F2;"> $HOME</span><span style="color:#E6DB74;">/.kube</span></span>
<span class="line"><span style="color:#A6E22E;">sudo</span><span style="color:#E6DB74;"> cp</span><span style="color:#AE81FF;"> -i</span><span style="color:#E6DB74;"> /etc/kubernetes/admin.conf</span><span style="color:#F8F8F2;"> $HOME</span><span style="color:#E6DB74;">/.kube/config</span></span>
<span class="line"><span style="color:#A6E22E;">sudo</span><span style="color:#E6DB74;"> chown</span><span style="color:#F8F8F2;"> $(</span><span style="color:#A6E22E;">id</span><span style="color:#AE81FF;"> -u</span><span style="color:#F8F8F2;">)</span><span style="color:#E6DB74;">:</span><span style="color:#F8F8F2;">$(</span><span style="color:#A6E22E;">id</span><span style="color:#AE81FF;"> -g</span><span style="color:#F8F8F2;">) $HOME</span><span style="color:#E6DB74;">/.kube/config</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="接入工作节点" tabindex="-1">接入工作节点 <a class="header-anchor" href="#接入工作节点" aria-label="Permalink to “接入工作节点”">​</a></h3><p>step01 初始化完master节点后根据提示信息，运行命令行接入工作节点</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">kubeadm</span><span style="color:#E6DB74;"> join</span><span style="color:#E6DB74;"> 192.168.10.101:6443</span><span style="color:#AE81FF;"> --token</span><span style="color:#E6DB74;"> i1naf8.xow4edf2qge2eunm</span><span style="color:#AE81FF;"> \\</span></span>
<span class="line"><span style="color:#AE81FF;">    --discovery-token-ca-cert-hash</span><span style="color:#E6DB74;"> sha256:53829e427e7aedc97d22180b0cbc171faa13ee05f75a77e9377bf6fbd2b8c4d5</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>如果忘记token信息也可以通过以下方式查看或者重新生成token</p><p>注：以下命令行在master节点上执行</p><p>step01 获取token</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">kubeadm</span><span style="color:#E6DB74;"> token</span><span style="color:#E6DB74;"> list</span><span style="color:#AE81FF;"> --help</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>step02 获取ca证书公钥的hash</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">openssl</span><span style="color:#E6DB74;"> x509</span><span style="color:#AE81FF;"> -in</span><span style="color:#E6DB74;"> /etc/kubernetes/pki/ca.crt</span><span style="color:#AE81FF;"> -pubkey</span><span style="color:#F92672;"> |</span><span style="color:#A6E22E;"> openssl</span><span style="color:#E6DB74;"> rsa</span><span style="color:#AE81FF;"> -pubin</span><span style="color:#AE81FF;"> -outform</span><span style="color:#E6DB74;"> der</span><span style="color:#F92672;"> 2&gt;</span><span style="color:#E6DB74;">/dev/null</span><span style="color:#F92672;"> |</span><span style="color:#A6E22E;"> openssl</span><span style="color:#E6DB74;"> sha256</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>step03 通过获取的token和ca证书公钥的hash值</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">kubeadm</span><span style="color:#E6DB74;"> join</span><span style="color:#F8F8F2;"> [api-server-endpoint] --token [token] --discovery-token-ca-cert-hash sha256:[discovery-token-ca-cert-hash]</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>或者使用命令行生成新的token</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">kubeadm</span><span style="color:#E6DB74;"> token</span><span style="color:#E6DB74;"> create</span><span style="color:#AE81FF;"> --print-join-command</span><span style="color:#AE81FF;"> --kubeconfig</span><span style="color:#E6DB74;"> config</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="更新证书过期时间" tabindex="-1">更新证书过期时间 <a class="header-anchor" href="#更新证书过期时间" aria-label="Permalink to “更新证书过期时间”">​</a></h2><p>👉<a href="/vdocs/docs/devops/at2yf0f2b3hL.html">如何更新证书过期时间</a></p><h2 id="安装calico网络插件" tabindex="-1">安装calico网络插件 <a class="header-anchor" href="#安装calico网络插件" aria-label="Permalink to “安装calico网络插件”">​</a></h2><p>下载calico网络插件的清单文件</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">curl</span><span style="color:#E6DB74;"> https://docs.projectcalico.org/v3.10/manifests/canal.yaml</span><span style="color:#AE81FF;"> -O</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>或者通过下面的编排文件部署</p><p>注意事项：如果出现多网卡或者未识别正确的网卡时，需要指定<code>DaemonSet/calico-node</code>资源<code>calico-node</code>容器中的环境变量<code>IP_AUTODETECTION_METHOD=&quot;interface=ens.*&quot;</code></p><div class="language-yaml line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#88846F;"># Source: calico/templates/calico-config.yaml</span></span>
<span class="line"><span style="color:#88846F;"># This ConfigMap is used to configure a self-hosted Calico installation.</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ConfigMap</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-config</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kube-system</span></span>
<span class="line"><span style="color:#F92672;">data</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">  # Typha is disabled.</span></span>
<span class="line"><span style="color:#F92672;">  typha_service_name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;none&quot;</span></span>
<span class="line"><span style="color:#88846F;">  # Configure the backend to use.</span></span>
<span class="line"><span style="color:#F92672;">  calico_backend</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;bird&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;">  # Configure the MTU to use</span></span>
<span class="line"><span style="color:#F92672;">  veth_mtu</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;1440&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;">  # The CNI network configuration to install on each node.  The special</span></span>
<span class="line"><span style="color:#88846F;">  # values in this config will be automatically populated.</span></span>
<span class="line"><span style="color:#F92672;">  cni_network_config</span><span style="color:#F8F8F2;">: </span><span style="color:#F92672;">|-</span></span>
<span class="line"><span style="color:#E6DB74;">    {</span></span>
<span class="line"><span style="color:#E6DB74;">      &quot;name&quot;: &quot;k8s-pod-network&quot;,</span></span>
<span class="line"><span style="color:#E6DB74;">      &quot;cniVersion&quot;: &quot;0.3.1&quot;,</span></span>
<span class="line"><span style="color:#E6DB74;">      &quot;plugins&quot;: [</span></span>
<span class="line"><span style="color:#E6DB74;">        {</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;type&quot;: &quot;calico&quot;,</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;log_level&quot;: &quot;info&quot;,</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;datastore_type&quot;: &quot;kubernetes&quot;,</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;nodename&quot;: &quot;__KUBERNETES_NODE_NAME__&quot;,</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;mtu&quot;: __CNI_MTU__,</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;ipam&quot;: {</span></span>
<span class="line"><span style="color:#E6DB74;">              &quot;type&quot;: &quot;calico-ipam&quot;</span></span>
<span class="line"><span style="color:#E6DB74;">          },</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;policy&quot;: {</span></span>
<span class="line"><span style="color:#E6DB74;">              &quot;type&quot;: &quot;k8s&quot;</span></span>
<span class="line"><span style="color:#E6DB74;">          },</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;kubernetes&quot;: {</span></span>
<span class="line"><span style="color:#E6DB74;">              &quot;kubeconfig&quot;: &quot;__KUBECONFIG_FILEPATH__&quot;</span></span>
<span class="line"><span style="color:#E6DB74;">          }</span></span>
<span class="line"><span style="color:#E6DB74;">        },</span></span>
<span class="line"><span style="color:#E6DB74;">        {</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;type&quot;: &quot;portmap&quot;,</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;snat&quot;: true,</span></span>
<span class="line"><span style="color:#E6DB74;">          &quot;capabilities&quot;: {&quot;portMappings&quot;: true}</span></span>
<span class="line"><span style="color:#E6DB74;">        }</span></span>
<span class="line"><span style="color:#E6DB74;">      ]</span></span>
<span class="line"><span style="color:#E6DB74;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#88846F;"># Source: calico/templates/kdd-crds.yaml</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">   name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">felixconfigurations.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">FelixConfiguration</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">felixconfigurations</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">felixconfiguration</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ipamblocks.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IPAMBlock</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ipamblocks</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ipamblock</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">blockaffinities.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">BlockAffinity</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">blockaffinities</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">blockaffinity</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ipamhandles.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IPAMHandle</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ipamhandles</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ipamhandle</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ipamconfigs.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IPAMConfig</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ipamconfigs</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ipamconfig</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">bgppeers.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">BGPPeer</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">bgppeers</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">bgppeer</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">bgpconfigurations.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">BGPConfiguration</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">bgpconfigurations</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">bgpconfiguration</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ippools.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IPPool</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ippools</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ippool</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">hostendpoints.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">HostEndpoint</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">hostendpoints</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">hostendpoint</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">clusterinformations.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterInformation</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">clusterinformations</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">clusterinformation</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">globalnetworkpolicies.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">GlobalNetworkPolicy</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">globalnetworkpolicies</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">globalnetworkpolicy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">globalnetworksets.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Cluster</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">GlobalNetworkSet</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">globalnetworksets</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">globalnetworkset</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">networkpolicies.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Namespaced</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">NetworkPolicy</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">networkpolicies</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">networkpolicy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apiextensions.k8s.io/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CustomResourceDefinition</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">networksets.crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  scope</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Namespaced</span></span>
<span class="line"><span style="color:#F92672;">  group</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">crd.projectcalico.org</span></span>
<span class="line"><span style="color:#F92672;">  version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">  names</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">NetworkSet</span></span>
<span class="line"><span style="color:#F92672;">    plural</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">networksets</span></span>
<span class="line"><span style="color:#F92672;">    singular</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">networkset</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#88846F;"># Source: calico/templates/rbac.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># Include a clusterrole for the kube-controllers component,</span></span>
<span class="line"><span style="color:#88846F;"># and bind it to the calico-kube-controllers serviceaccount.</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterRole</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io/v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">rules</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">  # Nodes are watched to monitor for deletions.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">nodes</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">watch</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#88846F;">  # Pods are queried to check for existence.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">pods</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#88846F;">  # IPAM resources are manipulated when nodes are deleted.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;crd.projectcalico.org&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ippools</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;crd.projectcalico.org&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">blockaffinities</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ipamblocks</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ipamhandles</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">create</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">update</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">delete</span></span>
<span class="line"><span style="color:#88846F;">  # Needs access to update clusterinformations.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;crd.projectcalico.org&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">clusterinformations</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">create</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">update</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterRoleBinding</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io/v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">roleRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  apiGroup</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io</span></span>
<span class="line"><span style="color:#F92672;">  kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterRole</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">subjects</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">- </span><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ServiceAccount</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kube-system</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#88846F;"># Include a clusterrole for the calico-node DaemonSet,</span></span>
<span class="line"><span style="color:#88846F;"># and bind it to the calico-node serviceaccount.</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterRole</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io/v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#F92672;">rules</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">  # The CNI plugin needs to get pods, nodes, and namespaces.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">pods</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">nodes</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">namespaces</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">endpoints</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">services</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">      # Used to discover service IPs for advertisement.</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">watch</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#88846F;">      # Used to discover Typhas.</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">nodes/status</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">      # Needed for clearing NodeNetworkUnavailable flag.</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">patch</span></span>
<span class="line"><span style="color:#88846F;">      # Calico stores some configuration information in node annotations.</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">update</span></span>
<span class="line"><span style="color:#88846F;">  # Watch for changes to Kubernetes NetworkPolicies.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;networking.k8s.io&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">networkpolicies</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">watch</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#88846F;">  # Used by Calico for policy information.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">pods</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">namespaces</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">serviceaccounts</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">watch</span></span>
<span class="line"><span style="color:#88846F;">  # The CNI plugin patches pods/status.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">pods/status</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">patch</span></span>
<span class="line"><span style="color:#88846F;">  # Calico monitors various CRDs for config.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;crd.projectcalico.org&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">globalfelixconfigs</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">felixconfigurations</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">bgppeers</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">globalbgpconfigs</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">bgpconfigurations</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ippools</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ipamblocks</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">globalnetworkpolicies</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">globalnetworksets</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">networkpolicies</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">networksets</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">clusterinformations</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">hostendpoints</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">watch</span></span>
<span class="line"><span style="color:#88846F;">  # Calico must create and update some CRDs on startup.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;crd.projectcalico.org&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ippools</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">felixconfigurations</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">clusterinformations</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">create</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">update</span></span>
<span class="line"><span style="color:#88846F;">  # Calico stores some configuration information on the node.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">nodes</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">watch</span></span>
<span class="line"><span style="color:#88846F;">  # These permissions are only requried for upgrade from v2.6, and can</span></span>
<span class="line"><span style="color:#88846F;">  # be removed after upgrade or on fresh installations.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;crd.projectcalico.org&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">bgpconfigurations</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">bgppeers</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">create</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">update</span></span>
<span class="line"><span style="color:#88846F;">  # These permissions are required for Calico CNI to perform IPAM allocations.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;crd.projectcalico.org&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">blockaffinities</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ipamblocks</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ipamhandles</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">create</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">update</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">delete</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;crd.projectcalico.org&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ipamconfigs</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#88846F;">  # Block affinities must also be watchable by confd for route aggregation.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;crd.projectcalico.org&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">blockaffinities</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">watch</span></span>
<span class="line"><span style="color:#88846F;">  # The Calico IPAM migration needs to get daemonsets. These permissions can be</span></span>
<span class="line"><span style="color:#88846F;">  # removed if not upgrading from an installation using host-local IPAM.</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;apps&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">daemonsets</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io/v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterRoleBinding</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#F92672;">roleRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  apiGroup</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io</span></span>
<span class="line"><span style="color:#F92672;">  kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterRole</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#F92672;">subjects</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">- </span><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ServiceAccount</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kube-system</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#88846F;"># Source: calico/templates/calico-node.yaml</span></span>
<span class="line"><span style="color:#88846F;"># This manifest installs the calico-node container, as well</span></span>
<span class="line"><span style="color:#88846F;"># as the CNI plugins and network config on</span></span>
<span class="line"><span style="color:#88846F;"># each master and worker node in a Kubernetes cluster.</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">DaemonSet</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apps/v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kube-system</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    k8s-app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    matchLabels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      k8s-app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#F92672;">  updateStrategy</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">RollingUpdate</span></span>
<span class="line"><span style="color:#F92672;">    rollingUpdate</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      maxUnavailable</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">1</span></span>
<span class="line"><span style="color:#F92672;">  template</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        k8s-app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#F92672;">      annotations</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">        # This, along with the CriticalAddonsOnly toleration below,</span></span>
<span class="line"><span style="color:#88846F;">        # marks the pod as a critical add-on, ensuring it gets</span></span>
<span class="line"><span style="color:#88846F;">        # priority scheduling and that its resources are reserved</span></span>
<span class="line"><span style="color:#88846F;">        # if it ever gets evicted.</span></span>
<span class="line"><span style="color:#F92672;">        scheduler.alpha.kubernetes.io/critical-pod</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&#39;&#39;</span></span>
<span class="line"><span style="color:#F92672;">    spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      nodeSelector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        beta.kubernetes.io/os</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">linux</span></span>
<span class="line"><span style="color:#F92672;">      hostNetwork</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">true</span></span>
<span class="line"><span style="color:#F92672;">      tolerations</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">        # Make sure calico-node gets scheduled on all nodes.</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">effect</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">NoSchedule</span></span>
<span class="line"><span style="color:#F92672;">          operator</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Exists</span></span>
<span class="line"><span style="color:#88846F;">        # Mark the pod as a critical add-on for rescheduling.</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">key</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CriticalAddonsOnly</span></span>
<span class="line"><span style="color:#F92672;">          operator</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Exists</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">effect</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">NoExecute</span></span>
<span class="line"><span style="color:#F92672;">          operator</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Exists</span></span>
<span class="line"><span style="color:#F92672;">      serviceAccountName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#88846F;">      # Minimize downtime during a rolling upgrade or deletion; tell Kubernetes to do a &quot;force</span></span>
<span class="line"><span style="color:#88846F;">      # deletion&quot;: https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods.</span></span>
<span class="line"><span style="color:#F92672;">      terminationGracePeriodSeconds</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">0</span></span>
<span class="line"><span style="color:#F92672;">      priorityClassName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">system-node-critical</span></span>
<span class="line"><span style="color:#F92672;">      initContainers</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">        # This container performs upgrade from host-local IPAM to calico-ipam.</span></span>
<span class="line"><span style="color:#88846F;">        # It can be deleted if this is a fresh installation, or if you have already</span></span>
<span class="line"><span style="color:#88846F;">        # upgraded to use calico-ipam.</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">upgrade-ipam</span></span>
<span class="line"><span style="color:#F92672;">          image</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico/cni:v3.8.4</span></span>
<span class="line"><span style="color:#F92672;">          imagePullPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IfNotPresent</span></span>
<span class="line"><span style="color:#F92672;">          command</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;/opt/cni/bin/calico-ipam&quot;</span><span style="color:#F8F8F2;">, </span><span style="color:#E6DB74;">&quot;-upgrade&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">          env</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">KUBERNETES_NODE_NAME</span></span>
<span class="line"><span style="color:#F92672;">              valueFrom</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                fieldRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                  fieldPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">spec.nodeName</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CALICO_NETWORKING_BACKEND</span></span>
<span class="line"><span style="color:#F92672;">              valueFrom</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                configMapKeyRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-config</span></span>
<span class="line"><span style="color:#F92672;">                  key</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico_backend</span></span>
<span class="line"><span style="color:#F92672;">          volumeMounts</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/var/lib/cni/networks</span></span>
<span class="line"><span style="color:#F92672;">              name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">host-local-net-dir</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/host/opt/cni/bin</span></span>
<span class="line"><span style="color:#F92672;">              name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">cni-bin-dir</span></span>
<span class="line"><span style="color:#F92672;">          securityContext</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            privileged</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">true</span></span>
<span class="line"><span style="color:#88846F;">        # This container installs the CNI binaries</span></span>
<span class="line"><span style="color:#88846F;">        # and CNI network config file on each node.</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">install-cni</span></span>
<span class="line"><span style="color:#F92672;">          image</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico/cni:v3.8.4</span></span>
<span class="line"><span style="color:#F92672;">          imagePullPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IfNotPresent</span></span>
<span class="line"><span style="color:#F92672;">          command</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;/install-cni.sh&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">          env</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">            # Name of the CNI config file to create.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CNI_CONF_NAME</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;10-calico.conflist&quot;</span></span>
<span class="line"><span style="color:#88846F;">            # The CNI network config to install on each node.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CNI_NETWORK_CONFIG</span></span>
<span class="line"><span style="color:#F92672;">              valueFrom</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                configMapKeyRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-config</span></span>
<span class="line"><span style="color:#F92672;">                  key</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">cni_network_config</span></span>
<span class="line"><span style="color:#88846F;">            # Set the hostname based on the k8s node name.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">KUBERNETES_NODE_NAME</span></span>
<span class="line"><span style="color:#F92672;">              valueFrom</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                fieldRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                  fieldPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">spec.nodeName</span></span>
<span class="line"><span style="color:#88846F;">            # CNI MTU Config variable</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CNI_MTU</span></span>
<span class="line"><span style="color:#F92672;">              valueFrom</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                configMapKeyRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-config</span></span>
<span class="line"><span style="color:#F92672;">                  key</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">veth_mtu</span></span>
<span class="line"><span style="color:#88846F;">            # Prevents the container from sleeping forever.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">SLEEP</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#F92672;">          volumeMounts</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/host/opt/cni/bin</span></span>
<span class="line"><span style="color:#F92672;">              name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">cni-bin-dir</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/host/etc/cni/net.d</span></span>
<span class="line"><span style="color:#F92672;">              name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">cni-net-dir</span></span>
<span class="line"><span style="color:#F92672;">          securityContext</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            privileged</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">true</span></span>
<span class="line"><span style="color:#88846F;">        # Adds a Flex Volume Driver that creates a per-pod Unix Domain Socket to allow Dikastes</span></span>
<span class="line"><span style="color:#88846F;">        # to communicate with Felix over the Policy Sync API.</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">flexvol-driver</span></span>
<span class="line"><span style="color:#F92672;">          image</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico/pod2daemon-flexvol:v3.8.4</span></span>
<span class="line"><span style="color:#F92672;">          imagePullPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IfNotPresent</span></span>
<span class="line"><span style="color:#F92672;">          volumeMounts</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">          - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">flexvol-driver-host</span></span>
<span class="line"><span style="color:#F92672;">            mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/host/driver</span></span>
<span class="line"><span style="color:#F92672;">          securityContext</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            privileged</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">true</span></span>
<span class="line"><span style="color:#F92672;">      containers</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">        # Runs calico-node container on each Kubernetes node.  This</span></span>
<span class="line"><span style="color:#88846F;">        # container programs network policy and routes on each</span></span>
<span class="line"><span style="color:#88846F;">        # host.</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#F92672;">          image</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico/node:v3.8.4</span></span>
<span class="line"><span style="color:#F92672;">          imagePullPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IfNotPresent</span></span>
<span class="line"><span style="color:#F92672;">          env</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">            # Use Kubernetes API as the backing datastore.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">DATASTORE_TYPE</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;kubernetes&quot;</span></span>
<span class="line"><span style="color:#88846F;">            # Wait for the datastore.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">WAIT_FOR_DATASTORE</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#88846F;">            # Set based on the k8s node name.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">NODENAME</span></span>
<span class="line"><span style="color:#F92672;">              valueFrom</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                fieldRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                  fieldPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">spec.nodeName</span></span>
<span class="line"><span style="color:#88846F;">            # Choose the backend to use.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CALICO_NETWORKING_BACKEND</span></span>
<span class="line"><span style="color:#F92672;">              valueFrom</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                configMapKeyRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-config</span></span>
<span class="line"><span style="color:#F92672;">                  key</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico_backend</span></span>
<span class="line"><span style="color:#88846F;">            # Cluster type to identify the deployment type</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CLUSTER_TYPE</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;k8s,bgp&quot;</span></span>
<span class="line highlighted"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IP_AUTODETECTION_METHOD</span></span>
<span class="line highlighted"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;interface=ens.*&quot;</span></span>
<span class="line"><span style="color:#88846F;">            # Auto-detect the BGP IP address.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IP</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;autodetect&quot;</span></span>
<span class="line"><span style="color:#88846F;">            # Enable IPIP</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CALICO_IPV4POOL_IPIP</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;Always&quot;</span></span>
<span class="line"><span style="color:#88846F;">            # Set MTU for tunnel device used if ipip is enabled</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">FELIX_IPINIPMTU</span></span>
<span class="line"><span style="color:#F92672;">              valueFrom</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                configMapKeyRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-config</span></span>
<span class="line"><span style="color:#F92672;">                  key</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">veth_mtu</span></span>
<span class="line"><span style="color:#88846F;">            # The default IPv4 pool to create on startup if none exists. Pod IPs will be</span></span>
<span class="line"><span style="color:#88846F;">            # chosen from this range. Changing this value after installation will have</span></span>
<span class="line"><span style="color:#88846F;">            # no effect. This should fall within \`--cluster-cidr\`.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CALICO_IPV4POOL_CIDR</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;172.16.0.0/16&quot;</span></span>
<span class="line"><span style="color:#88846F;">            # Disable file logging so \`kubectl logs\` works.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CALICO_DISABLE_FILE_LOGGING</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#88846F;">            # Set Felix endpoint to host default action to ACCEPT.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">FELIX_DEFAULTENDPOINTTOHOSTACTION</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;ACCEPT&quot;</span></span>
<span class="line"><span style="color:#88846F;">            # Disable IPv6 on Kubernetes.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">FELIX_IPV6SUPPORT</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#88846F;">            # Set Felix logging to &quot;info&quot;</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">FELIX_LOGSEVERITYSCREEN</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;info&quot;</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">FELIX_HEALTHENABLED</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#F92672;">          securityContext</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            privileged</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">true</span></span>
<span class="line"><span style="color:#F92672;">          resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            requests</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">              cpu</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">250m</span></span>
<span class="line"><span style="color:#F92672;">          livenessProbe</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            httpGet</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">              path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/liveness</span></span>
<span class="line"><span style="color:#F92672;">              port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">9099</span></span>
<span class="line"><span style="color:#F92672;">              host</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">localhost</span></span>
<span class="line"><span style="color:#F92672;">            periodSeconds</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">10</span></span>
<span class="line"><span style="color:#F92672;">            initialDelaySeconds</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">10</span></span>
<span class="line"><span style="color:#F92672;">            failureThreshold</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">6</span></span>
<span class="line"><span style="color:#F92672;">          readinessProbe</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            exec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">              command</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">              - </span><span style="color:#E6DB74;">/bin/calico-node</span></span>
<span class="line"><span style="color:#F8F8F2;">              - </span><span style="color:#E6DB74;">-bird-ready</span></span>
<span class="line"><span style="color:#F8F8F2;">              - </span><span style="color:#E6DB74;">-felix-ready</span></span>
<span class="line"><span style="color:#F92672;">            periodSeconds</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">10</span></span>
<span class="line"><span style="color:#F92672;">          volumeMounts</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/lib/modules</span></span>
<span class="line"><span style="color:#F92672;">              name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">lib-modules</span></span>
<span class="line"><span style="color:#F92672;">              readOnly</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">true</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/run/xtables.lock</span></span>
<span class="line"><span style="color:#F92672;">              name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">xtables-lock</span></span>
<span class="line"><span style="color:#F92672;">              readOnly</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">false</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/var/run/calico</span></span>
<span class="line"><span style="color:#F92672;">              name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">var-run-calico</span></span>
<span class="line"><span style="color:#F92672;">              readOnly</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">false</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/var/lib/calico</span></span>
<span class="line"><span style="color:#F92672;">              name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">var-lib-calico</span></span>
<span class="line"><span style="color:#F92672;">              readOnly</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">false</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">policysync</span></span>
<span class="line"><span style="color:#F92672;">              mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/var/run/nodeagent</span></span>
<span class="line"><span style="color:#F92672;">      volumes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">        # Used by calico-node.</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">lib-modules</span></span>
<span class="line"><span style="color:#F92672;">          hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/lib/modules</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">var-run-calico</span></span>
<span class="line"><span style="color:#F92672;">          hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/var/run/calico</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">var-lib-calico</span></span>
<span class="line"><span style="color:#F92672;">          hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/var/lib/calico</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">xtables-lock</span></span>
<span class="line"><span style="color:#F92672;">          hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/run/xtables.lock</span></span>
<span class="line"><span style="color:#F92672;">            type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">FileOrCreate</span></span>
<span class="line"><span style="color:#88846F;">        # Used to install CNI.</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">cni-bin-dir</span></span>
<span class="line"><span style="color:#F92672;">          hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/opt/cni/bin</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">cni-net-dir</span></span>
<span class="line"><span style="color:#F92672;">          hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/etc/cni/net.d</span></span>
<span class="line"><span style="color:#88846F;">        # Mount in the directory for host-local IPAM allocations. This is</span></span>
<span class="line"><span style="color:#88846F;">        # used when upgrading from host-local to calico-ipam, and can be removed</span></span>
<span class="line"><span style="color:#88846F;">        # if not using the upgrade-ipam init container.</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">host-local-net-dir</span></span>
<span class="line"><span style="color:#F92672;">          hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/var/lib/cni/networks</span></span>
<span class="line"><span style="color:#88846F;">        # Used to create per-pod Unix Domain Sockets</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">policysync</span></span>
<span class="line"><span style="color:#F92672;">          hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">DirectoryOrCreate</span></span>
<span class="line"><span style="color:#F92672;">            path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/var/run/nodeagent</span></span>
<span class="line"><span style="color:#88846F;">        # Used to install Flex Volume Driver</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">flexvol-driver-host</span></span>
<span class="line"><span style="color:#F92672;">          hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">DirectoryOrCreate</span></span>
<span class="line"><span style="color:#F92672;">            path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/usr/libexec/kubernetes/kubelet-plugins/volume/exec/nodeagent~uds</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ServiceAccount</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-node</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kube-system</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#88846F;"># Source: calico/templates/calico-kube-controllers.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># See https://github.com/projectcalico/kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apps/v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Deployment</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kube-system</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    k8s-app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">  # The controllers can only have a single active instance.</span></span>
<span class="line"><span style="color:#F92672;">  replicas</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">1</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    matchLabels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      k8s-app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">  strategy</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Recreate</span></span>
<span class="line"><span style="color:#F92672;">  template</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">      namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kube-system</span></span>
<span class="line"><span style="color:#F92672;">      labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        k8s-app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">      annotations</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        scheduler.alpha.kubernetes.io/critical-pod</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&#39;&#39;</span></span>
<span class="line"><span style="color:#F92672;">    spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      nodeSelector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        beta.kubernetes.io/os</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">linux</span></span>
<span class="line"><span style="color:#F92672;">      tolerations</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">        # Mark the pod as a critical add-on for rescheduling.</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">key</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">CriticalAddonsOnly</span></span>
<span class="line"><span style="color:#F92672;">          operator</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Exists</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">key</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">node-role.kubernetes.io/master</span></span>
<span class="line"><span style="color:#F92672;">          effect</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">NoSchedule</span></span>
<span class="line"><span style="color:#F92672;">      serviceAccountName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">      priorityClassName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">system-cluster-critical</span></span>
<span class="line"><span style="color:#F92672;">      containers</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">          image</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico/kube-controllers:v3.8.4</span></span>
<span class="line"><span style="color:#F92672;">          imagePullPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">IfNotPresent</span></span>
<span class="line"><span style="color:#F92672;">          env</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">            # Choose which controllers to run.</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ENABLED_CONTROLLERS</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">node</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">DATASTORE_TYPE</span></span>
<span class="line"><span style="color:#F92672;">              value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kubernetes</span></span>
<span class="line"><span style="color:#F92672;">          readinessProbe</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            exec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">              command</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">              - </span><span style="color:#E6DB74;">/usr/bin/check-status</span></span>
<span class="line"><span style="color:#F8F8F2;">              - </span><span style="color:#E6DB74;">-r</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ServiceAccount</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">calico-kube-controllers</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kube-system</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#88846F;"># Source: calico/templates/calico-etcd-secrets.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#88846F;"># Source: calico/templates/calico-typha.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#88846F;"># Source: calico/templates/configure-canal.yaml</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br><span class="line-number">256</span><br><span class="line-number">257</span><br><span class="line-number">258</span><br><span class="line-number">259</span><br><span class="line-number">260</span><br><span class="line-number">261</span><br><span class="line-number">262</span><br><span class="line-number">263</span><br><span class="line-number">264</span><br><span class="line-number">265</span><br><span class="line-number">266</span><br><span class="line-number">267</span><br><span class="line-number">268</span><br><span class="line-number">269</span><br><span class="line-number">270</span><br><span class="line-number">271</span><br><span class="line-number">272</span><br><span class="line-number">273</span><br><span class="line-number">274</span><br><span class="line-number">275</span><br><span class="line-number">276</span><br><span class="line-number">277</span><br><span class="line-number">278</span><br><span class="line-number">279</span><br><span class="line-number">280</span><br><span class="line-number">281</span><br><span class="line-number">282</span><br><span class="line-number">283</span><br><span class="line-number">284</span><br><span class="line-number">285</span><br><span class="line-number">286</span><br><span class="line-number">287</span><br><span class="line-number">288</span><br><span class="line-number">289</span><br><span class="line-number">290</span><br><span class="line-number">291</span><br><span class="line-number">292</span><br><span class="line-number">293</span><br><span class="line-number">294</span><br><span class="line-number">295</span><br><span class="line-number">296</span><br><span class="line-number">297</span><br><span class="line-number">298</span><br><span class="line-number">299</span><br><span class="line-number">300</span><br><span class="line-number">301</span><br><span class="line-number">302</span><br><span class="line-number">303</span><br><span class="line-number">304</span><br><span class="line-number">305</span><br><span class="line-number">306</span><br><span class="line-number">307</span><br><span class="line-number">308</span><br><span class="line-number">309</span><br><span class="line-number">310</span><br><span class="line-number">311</span><br><span class="line-number">312</span><br><span class="line-number">313</span><br><span class="line-number">314</span><br><span class="line-number">315</span><br><span class="line-number">316</span><br><span class="line-number">317</span><br><span class="line-number">318</span><br><span class="line-number">319</span><br><span class="line-number">320</span><br><span class="line-number">321</span><br><span class="line-number">322</span><br><span class="line-number">323</span><br><span class="line-number">324</span><br><span class="line-number">325</span><br><span class="line-number">326</span><br><span class="line-number">327</span><br><span class="line-number">328</span><br><span class="line-number">329</span><br><span class="line-number">330</span><br><span class="line-number">331</span><br><span class="line-number">332</span><br><span class="line-number">333</span><br><span class="line-number">334</span><br><span class="line-number">335</span><br><span class="line-number">336</span><br><span class="line-number">337</span><br><span class="line-number">338</span><br><span class="line-number">339</span><br><span class="line-number">340</span><br><span class="line-number">341</span><br><span class="line-number">342</span><br><span class="line-number">343</span><br><span class="line-number">344</span><br><span class="line-number">345</span><br><span class="line-number">346</span><br><span class="line-number">347</span><br><span class="line-number">348</span><br><span class="line-number">349</span><br><span class="line-number">350</span><br><span class="line-number">351</span><br><span class="line-number">352</span><br><span class="line-number">353</span><br><span class="line-number">354</span><br><span class="line-number">355</span><br><span class="line-number">356</span><br><span class="line-number">357</span><br><span class="line-number">358</span><br><span class="line-number">359</span><br><span class="line-number">360</span><br><span class="line-number">361</span><br><span class="line-number">362</span><br><span class="line-number">363</span><br><span class="line-number">364</span><br><span class="line-number">365</span><br><span class="line-number">366</span><br><span class="line-number">367</span><br><span class="line-number">368</span><br><span class="line-number">369</span><br><span class="line-number">370</span><br><span class="line-number">371</span><br><span class="line-number">372</span><br><span class="line-number">373</span><br><span class="line-number">374</span><br><span class="line-number">375</span><br><span class="line-number">376</span><br><span class="line-number">377</span><br><span class="line-number">378</span><br><span class="line-number">379</span><br><span class="line-number">380</span><br><span class="line-number">381</span><br><span class="line-number">382</span><br><span class="line-number">383</span><br><span class="line-number">384</span><br><span class="line-number">385</span><br><span class="line-number">386</span><br><span class="line-number">387</span><br><span class="line-number">388</span><br><span class="line-number">389</span><br><span class="line-number">390</span><br><span class="line-number">391</span><br><span class="line-number">392</span><br><span class="line-number">393</span><br><span class="line-number">394</span><br><span class="line-number">395</span><br><span class="line-number">396</span><br><span class="line-number">397</span><br><span class="line-number">398</span><br><span class="line-number">399</span><br><span class="line-number">400</span><br><span class="line-number">401</span><br><span class="line-number">402</span><br><span class="line-number">403</span><br><span class="line-number">404</span><br><span class="line-number">405</span><br><span class="line-number">406</span><br><span class="line-number">407</span><br><span class="line-number">408</span><br><span class="line-number">409</span><br><span class="line-number">410</span><br><span class="line-number">411</span><br><span class="line-number">412</span><br><span class="line-number">413</span><br><span class="line-number">414</span><br><span class="line-number">415</span><br><span class="line-number">416</span><br><span class="line-number">417</span><br><span class="line-number">418</span><br><span class="line-number">419</span><br><span class="line-number">420</span><br><span class="line-number">421</span><br><span class="line-number">422</span><br><span class="line-number">423</span><br><span class="line-number">424</span><br><span class="line-number">425</span><br><span class="line-number">426</span><br><span class="line-number">427</span><br><span class="line-number">428</span><br><span class="line-number">429</span><br><span class="line-number">430</span><br><span class="line-number">431</span><br><span class="line-number">432</span><br><span class="line-number">433</span><br><span class="line-number">434</span><br><span class="line-number">435</span><br><span class="line-number">436</span><br><span class="line-number">437</span><br><span class="line-number">438</span><br><span class="line-number">439</span><br><span class="line-number">440</span><br><span class="line-number">441</span><br><span class="line-number">442</span><br><span class="line-number">443</span><br><span class="line-number">444</span><br><span class="line-number">445</span><br><span class="line-number">446</span><br><span class="line-number">447</span><br><span class="line-number">448</span><br><span class="line-number">449</span><br><span class="line-number">450</span><br><span class="line-number">451</span><br><span class="line-number">452</span><br><span class="line-number">453</span><br><span class="line-number">454</span><br><span class="line-number">455</span><br><span class="line-number">456</span><br><span class="line-number">457</span><br><span class="line-number">458</span><br><span class="line-number">459</span><br><span class="line-number">460</span><br><span class="line-number">461</span><br><span class="line-number">462</span><br><span class="line-number">463</span><br><span class="line-number">464</span><br><span class="line-number">465</span><br><span class="line-number">466</span><br><span class="line-number">467</span><br><span class="line-number">468</span><br><span class="line-number">469</span><br><span class="line-number">470</span><br><span class="line-number">471</span><br><span class="line-number">472</span><br><span class="line-number">473</span><br><span class="line-number">474</span><br><span class="line-number">475</span><br><span class="line-number">476</span><br><span class="line-number">477</span><br><span class="line-number">478</span><br><span class="line-number">479</span><br><span class="line-number">480</span><br><span class="line-number">481</span><br><span class="line-number">482</span><br><span class="line-number">483</span><br><span class="line-number">484</span><br><span class="line-number">485</span><br><span class="line-number">486</span><br><span class="line-number">487</span><br><span class="line-number">488</span><br><span class="line-number">489</span><br><span class="line-number">490</span><br><span class="line-number">491</span><br><span class="line-number">492</span><br><span class="line-number">493</span><br><span class="line-number">494</span><br><span class="line-number">495</span><br><span class="line-number">496</span><br><span class="line-number">497</span><br><span class="line-number">498</span><br><span class="line-number">499</span><br><span class="line-number">500</span><br><span class="line-number">501</span><br><span class="line-number">502</span><br><span class="line-number">503</span><br><span class="line-number">504</span><br><span class="line-number">505</span><br><span class="line-number">506</span><br><span class="line-number">507</span><br><span class="line-number">508</span><br><span class="line-number">509</span><br><span class="line-number">510</span><br><span class="line-number">511</span><br><span class="line-number">512</span><br><span class="line-number">513</span><br><span class="line-number">514</span><br><span class="line-number">515</span><br><span class="line-number">516</span><br><span class="line-number">517</span><br><span class="line-number">518</span><br><span class="line-number">519</span><br><span class="line-number">520</span><br><span class="line-number">521</span><br><span class="line-number">522</span><br><span class="line-number">523</span><br><span class="line-number">524</span><br><span class="line-number">525</span><br><span class="line-number">526</span><br><span class="line-number">527</span><br><span class="line-number">528</span><br><span class="line-number">529</span><br><span class="line-number">530</span><br><span class="line-number">531</span><br><span class="line-number">532</span><br><span class="line-number">533</span><br><span class="line-number">534</span><br><span class="line-number">535</span><br><span class="line-number">536</span><br><span class="line-number">537</span><br><span class="line-number">538</span><br><span class="line-number">539</span><br><span class="line-number">540</span><br><span class="line-number">541</span><br><span class="line-number">542</span><br><span class="line-number">543</span><br><span class="line-number">544</span><br><span class="line-number">545</span><br><span class="line-number">546</span><br><span class="line-number">547</span><br><span class="line-number">548</span><br><span class="line-number">549</span><br><span class="line-number">550</span><br><span class="line-number">551</span><br><span class="line-number">552</span><br><span class="line-number">553</span><br><span class="line-number">554</span><br><span class="line-number">555</span><br><span class="line-number">556</span><br><span class="line-number">557</span><br><span class="line-number">558</span><br><span class="line-number">559</span><br><span class="line-number">560</span><br><span class="line-number">561</span><br><span class="line-number">562</span><br><span class="line-number">563</span><br><span class="line-number">564</span><br><span class="line-number">565</span><br><span class="line-number">566</span><br><span class="line-number">567</span><br><span class="line-number">568</span><br><span class="line-number">569</span><br><span class="line-number">570</span><br><span class="line-number">571</span><br><span class="line-number">572</span><br><span class="line-number">573</span><br><span class="line-number">574</span><br><span class="line-number">575</span><br><span class="line-number">576</span><br><span class="line-number">577</span><br><span class="line-number">578</span><br><span class="line-number">579</span><br><span class="line-number">580</span><br><span class="line-number">581</span><br><span class="line-number">582</span><br><span class="line-number">583</span><br><span class="line-number">584</span><br><span class="line-number">585</span><br><span class="line-number">586</span><br><span class="line-number">587</span><br><span class="line-number">588</span><br><span class="line-number">589</span><br><span class="line-number">590</span><br><span class="line-number">591</span><br><span class="line-number">592</span><br><span class="line-number">593</span><br><span class="line-number">594</span><br><span class="line-number">595</span><br><span class="line-number">596</span><br><span class="line-number">597</span><br><span class="line-number">598</span><br><span class="line-number">599</span><br><span class="line-number">600</span><br><span class="line-number">601</span><br><span class="line-number">602</span><br><span class="line-number">603</span><br><span class="line-number">604</span><br><span class="line-number">605</span><br><span class="line-number">606</span><br><span class="line-number">607</span><br><span class="line-number">608</span><br><span class="line-number">609</span><br><span class="line-number">610</span><br><span class="line-number">611</span><br><span class="line-number">612</span><br><span class="line-number">613</span><br><span class="line-number">614</span><br><span class="line-number">615</span><br><span class="line-number">616</span><br><span class="line-number">617</span><br><span class="line-number">618</span><br><span class="line-number">619</span><br><span class="line-number">620</span><br><span class="line-number">621</span><br><span class="line-number">622</span><br><span class="line-number">623</span><br><span class="line-number">624</span><br><span class="line-number">625</span><br><span class="line-number">626</span><br><span class="line-number">627</span><br><span class="line-number">628</span><br><span class="line-number">629</span><br><span class="line-number">630</span><br><span class="line-number">631</span><br><span class="line-number">632</span><br><span class="line-number">633</span><br><span class="line-number">634</span><br><span class="line-number">635</span><br><span class="line-number">636</span><br><span class="line-number">637</span><br><span class="line-number">638</span><br><span class="line-number">639</span><br><span class="line-number">640</span><br><span class="line-number">641</span><br><span class="line-number">642</span><br><span class="line-number">643</span><br><span class="line-number">644</span><br><span class="line-number">645</span><br><span class="line-number">646</span><br><span class="line-number">647</span><br><span class="line-number">648</span><br><span class="line-number">649</span><br><span class="line-number">650</span><br><span class="line-number">651</span><br><span class="line-number">652</span><br><span class="line-number">653</span><br><span class="line-number">654</span><br><span class="line-number">655</span><br><span class="line-number">656</span><br><span class="line-number">657</span><br><span class="line-number">658</span><br><span class="line-number">659</span><br><span class="line-number">660</span><br><span class="line-number">661</span><br><span class="line-number">662</span><br><span class="line-number">663</span><br><span class="line-number">664</span><br><span class="line-number">665</span><br><span class="line-number">666</span><br><span class="line-number">667</span><br><span class="line-number">668</span><br><span class="line-number">669</span><br><span class="line-number">670</span><br><span class="line-number">671</span><br><span class="line-number">672</span><br><span class="line-number">673</span><br><span class="line-number">674</span><br><span class="line-number">675</span><br><span class="line-number">676</span><br><span class="line-number">677</span><br><span class="line-number">678</span><br><span class="line-number">679</span><br><span class="line-number">680</span><br><span class="line-number">681</span><br><span class="line-number">682</span><br><span class="line-number">683</span><br><span class="line-number">684</span><br><span class="line-number">685</span><br><span class="line-number">686</span><br><span class="line-number">687</span><br><span class="line-number">688</span><br><span class="line-number">689</span><br><span class="line-number">690</span><br><span class="line-number">691</span><br><span class="line-number">692</span><br><span class="line-number">693</span><br><span class="line-number">694</span><br><span class="line-number">695</span><br><span class="line-number">696</span><br><span class="line-number">697</span><br><span class="line-number">698</span><br><span class="line-number">699</span><br><span class="line-number">700</span><br><span class="line-number">701</span><br><span class="line-number">702</span><br><span class="line-number">703</span><br><span class="line-number">704</span><br><span class="line-number">705</span><br><span class="line-number">706</span><br><span class="line-number">707</span><br><span class="line-number">708</span><br><span class="line-number">709</span><br><span class="line-number">710</span><br><span class="line-number">711</span><br><span class="line-number">712</span><br><span class="line-number">713</span><br><span class="line-number">714</span><br><span class="line-number">715</span><br><span class="line-number">716</span><br><span class="line-number">717</span><br><span class="line-number">718</span><br><span class="line-number">719</span><br><span class="line-number">720</span><br><span class="line-number">721</span><br><span class="line-number">722</span><br><span class="line-number">723</span><br><span class="line-number">724</span><br><span class="line-number">725</span><br><span class="line-number">726</span><br><span class="line-number">727</span><br><span class="line-number">728</span><br><span class="line-number">729</span><br><span class="line-number">730</span><br><span class="line-number">731</span><br><span class="line-number">732</span><br><span class="line-number">733</span><br><span class="line-number">734</span><br><span class="line-number">735</span><br><span class="line-number">736</span><br><span class="line-number">737</span><br><span class="line-number">738</span><br><span class="line-number">739</span><br><span class="line-number">740</span><br><span class="line-number">741</span><br><span class="line-number">742</span><br><span class="line-number">743</span><br><span class="line-number">744</span><br><span class="line-number">745</span><br><span class="line-number">746</span><br><span class="line-number">747</span><br><span class="line-number">748</span><br><span class="line-number">749</span><br><span class="line-number">750</span><br><span class="line-number">751</span><br><span class="line-number">752</span><br><span class="line-number">753</span><br><span class="line-number">754</span><br><span class="line-number">755</span><br><span class="line-number">756</span><br><span class="line-number">757</span><br><span class="line-number">758</span><br><span class="line-number">759</span><br><span class="line-number">760</span><br><span class="line-number">761</span><br><span class="line-number">762</span><br><span class="line-number">763</span><br><span class="line-number">764</span><br><span class="line-number">765</span><br><span class="line-number">766</span><br><span class="line-number">767</span><br><span class="line-number">768</span><br><span class="line-number">769</span><br><span class="line-number">770</span><br><span class="line-number">771</span><br><span class="line-number">772</span><br><span class="line-number">773</span><br><span class="line-number">774</span><br><span class="line-number">775</span><br><span class="line-number">776</span><br><span class="line-number">777</span><br><span class="line-number">778</span><br><span class="line-number">779</span><br><span class="line-number">780</span><br><span class="line-number">781</span><br><span class="line-number">782</span><br><span class="line-number">783</span><br><span class="line-number">784</span><br><span class="line-number">785</span><br><span class="line-number">786</span><br><span class="line-number">787</span><br><span class="line-number">788</span><br><span class="line-number">789</span><br><span class="line-number">790</span><br><span class="line-number">791</span><br><span class="line-number">792</span><br><span class="line-number">793</span><br><span class="line-number">794</span><br><span class="line-number">795</span><br></div></div><h3 id="calico客户端配置" tabindex="-1">calico客户端配置 <a class="header-anchor" href="#calico客户端配置" aria-label="Permalink to “calico客户端配置”">​</a></h3><p>step01 下载客户端可执行文件</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">wget</span><span style="color:#E6DB74;"> https://github.com/projectcalico/calicoctl/releases/download/v3.13.3/calicoctl</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>step02 客户端配置认证信息</p><p>通过<code>DATASTORE_TYPE</code>和<code>KUBECONFIG</code>指定认证信息</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F8F8F2;">DATASTORE_TYPE</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">kubernetes</span><span style="color:#F8F8F2;"> KUBECONFIG</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">~/.kube/config</span><span style="color:#A6E22E;"> calicoctl</span><span style="color:#E6DB74;"> get</span><span style="color:#E6DB74;"> nodes</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>或者使用配置文件的形式指定认证信息</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">cat</span><span style="color:#F92672;"> &gt;&gt;</span><span style="color:#E6DB74;"> /etc/calico/calicoctl.cfg</span><span style="color:#F92672;"> &lt;&lt;</span><span style="color:#F8F8F2;"> EOF</span></span>
<span class="line"><span style="color:#E6DB74;">apiVersion: projectcalico.org/v3</span></span>
<span class="line"><span style="color:#E6DB74;">kind: CalicoAPIConfig</span></span>
<span class="line"><span style="color:#E6DB74;">metadata:</span></span>
<span class="line"><span style="color:#E6DB74;">spec:</span></span>
<span class="line"><span style="color:#E6DB74;">  datastoreType: &quot;kubernetes&quot;</span></span>
<span class="line"><span style="color:#E6DB74;">  kubeconfig: &quot;/root/.kube/config&quot;</span></span>
<span class="line"><span style="color:#F8F8F2;">EOF</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="部署ingress-controller" tabindex="-1">部署ingress-controller <a class="header-anchor" href="#部署ingress-controller" aria-label="Permalink to “部署ingress-controller”">​</a></h2><p>step01 选一台工作节点设置标签</p><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#A6E22E;">kubectl</span><span style="color:#E6DB74;"> label</span><span style="color:#E6DB74;"> node</span><span style="color:#E6DB74;"> node02</span><span style="color:#E6DB74;"> kubernetes.io/ingress=nginx</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>step02 使用<code>ingress-controller.yaml</code>编排文件部署</p><div class="language-yaml line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Namespace</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ConfigMap</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-configuration</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ConfigMap</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">tcp-services</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ConfigMap</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">udp-services</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ServiceAccount</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-serviceaccount</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io/v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterRole</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-clusterrole</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">rules</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;&quot;</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">configmaps</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">endpoints</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">nodes</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">pods</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">secrets</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">watch</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;&quot;</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">nodes</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;&quot;</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">services</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">watch</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;&quot;</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">events</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">create</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">patch</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;extensions&quot;</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;networking.k8s.io&quot;</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ingresses</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">list</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">watch</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;extensions&quot;</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;networking.k8s.io&quot;</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ingresses/status</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">update</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io/v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Role</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-role</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">rules</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;&quot;</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">configmaps</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">pods</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">secrets</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">namespaces</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;&quot;</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">configmaps</span></span>
<span class="line"><span style="color:#F92672;">    resourceNames</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">      # Defaults to &quot;&lt;election-id&gt;-&lt;ingress-class&gt;&quot;</span></span>
<span class="line"><span style="color:#88846F;">      # Here: &quot;&lt;ingress-controller-leader&gt;-&lt;nginx&gt;&quot;</span></span>
<span class="line"><span style="color:#88846F;">      # This has to be adapted if you change either parameter</span></span>
<span class="line"><span style="color:#88846F;">      # when launching the nginx-ingress-controller.</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;ingress-controller-leader-nginx&quot;</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">update</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;&quot;</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">configmaps</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">create</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">apiGroups</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&quot;&quot;</span></span>
<span class="line"><span style="color:#F92672;">    resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">endpoints</span></span>
<span class="line"><span style="color:#F92672;">    verbs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">get</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io/v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">RoleBinding</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-role-nisa-binding</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">roleRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  apiGroup</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io</span></span>
<span class="line"><span style="color:#F92672;">  kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Role</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-role</span></span>
<span class="line"><span style="color:#F92672;">subjects</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ServiceAccount</span></span>
<span class="line"><span style="color:#F92672;">    name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-serviceaccount</span></span>
<span class="line"><span style="color:#F92672;">    namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io/v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterRoleBinding</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-clusterrole-nisa-binding</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">roleRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  apiGroup</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">rbac.authorization.k8s.io</span></span>
<span class="line"><span style="color:#F92672;">  kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterRole</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-clusterrole</span></span>
<span class="line"><span style="color:#F92672;">subjects</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ServiceAccount</span></span>
<span class="line"><span style="color:#F92672;">    name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-serviceaccount</span></span>
<span class="line"><span style="color:#F92672;">    namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apps/v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Deployment</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-controller</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  replicas</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">1</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    matchLabels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">      app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  template</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">        app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">      annotations</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        prometheus.io/port</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;10254&quot;</span></span>
<span class="line"><span style="color:#F92672;">        prometheus.io/scrape</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#F92672;">    spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#88846F;">      # wait up to five minutes for the drain of connections</span></span>
<span class="line"><span style="color:#F92672;">      terminationGracePeriodSeconds</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">300</span></span>
<span class="line"><span style="color:#F92672;">      serviceAccountName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-serviceaccount</span></span>
<span class="line"><span style="color:#F92672;">      nodeSelector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        kubernetes.io/ingress</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx</span></span>
<span class="line"><span style="color:#F92672;">      hostNetwork</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">true</span></span>
<span class="line"><span style="color:#F92672;">      containers</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">nginx-ingress-controller</span></span>
<span class="line"><span style="color:#88846F;">          #image: quay.io/kubernetes-ingress-controller/nginx-ingress-controller:0.30.0</span></span>
<span class="line"><span style="color:#F92672;">          image</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">registry.cn-hangzhou.aliyuncs.com/google_containers/nginx-ingress-controller:0.30.0</span></span>
<span class="line"><span style="color:#F92672;">          args</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#E6DB74;">/nginx-ingress-controller</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#E6DB74;">--configmap=$(POD_NAMESPACE)/nginx-configuration</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#E6DB74;">--tcp-services-configmap=$(POD_NAMESPACE)/tcp-services</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#E6DB74;">--udp-services-configmap=$(POD_NAMESPACE)/udp-services</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#E6DB74;">--publish-service=$(POD_NAMESPACE)/ingress-nginx</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#E6DB74;">--annotations-prefix=nginx.ingress.kubernetes.io</span></span>
<span class="line"><span style="color:#F92672;">          securityContext</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            allowPrivilegeEscalation</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">true</span></span>
<span class="line"><span style="color:#F92672;">            capabilities</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">              drop</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">                - </span><span style="color:#E6DB74;">ALL</span></span>
<span class="line"><span style="color:#F92672;">              add</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">                - </span><span style="color:#E6DB74;">NET_BIND_SERVICE</span></span>
<span class="line"><span style="color:#88846F;">            # www-data -&gt; 101</span></span>
<span class="line"><span style="color:#F92672;">            runAsUser</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">101</span></span>
<span class="line"><span style="color:#F92672;">          env</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">POD_NAME</span></span>
<span class="line"><span style="color:#F92672;">              valueFrom</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                fieldRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                  fieldPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">metadata.name</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">POD_NAMESPACE</span></span>
<span class="line"><span style="color:#F92672;">              valueFrom</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                fieldRef</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                  fieldPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">metadata.namespace</span></span>
<span class="line"><span style="color:#F92672;">          ports</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">http</span></span>
<span class="line"><span style="color:#F92672;">              containerPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">80</span></span>
<span class="line"><span style="color:#F92672;">              protocol</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">TCP</span></span>
<span class="line"><span style="color:#F8F8F2;">            - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">https</span></span>
<span class="line"><span style="color:#F92672;">              containerPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">443</span></span>
<span class="line"><span style="color:#F92672;">              protocol</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">TCP</span></span>
<span class="line"><span style="color:#F92672;">          livenessProbe</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            failureThreshold</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">3</span></span>
<span class="line"><span style="color:#F92672;">            httpGet</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">              path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/healthz</span></span>
<span class="line"><span style="color:#F92672;">              port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">10254</span></span>
<span class="line"><span style="color:#F92672;">              scheme</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">HTTP</span></span>
<span class="line"><span style="color:#F92672;">            initialDelaySeconds</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">10</span></span>
<span class="line"><span style="color:#F92672;">            periodSeconds</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">10</span></span>
<span class="line"><span style="color:#F92672;">            successThreshold</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">1</span></span>
<span class="line"><span style="color:#F92672;">            timeoutSeconds</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">10</span></span>
<span class="line"><span style="color:#F92672;">          readinessProbe</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            failureThreshold</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">3</span></span>
<span class="line"><span style="color:#F92672;">            httpGet</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">              path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/healthz</span></span>
<span class="line"><span style="color:#F92672;">              port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">10254</span></span>
<span class="line"><span style="color:#F92672;">              scheme</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">HTTP</span></span>
<span class="line"><span style="color:#F92672;">            periodSeconds</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">10</span></span>
<span class="line"><span style="color:#F92672;">            successThreshold</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">1</span></span>
<span class="line"><span style="color:#F92672;">            timeoutSeconds</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">10</span></span>
<span class="line"><span style="color:#F92672;">          lifecycle</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">            preStop</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">              exec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">                command</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">                  - </span><span style="color:#E6DB74;">/wait-shutdown</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">LimitRange</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  limits</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">min</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      memory</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">90Mi</span></span>
<span class="line"><span style="color:#F92672;">      cpu</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">100m</span></span>
<span class="line"><span style="color:#F92672;">    type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Container</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Service</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  namespace</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  externalTrafficPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Local</span></span>
<span class="line"><span style="color:#F92672;">  type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">LoadBalancer</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">    app.kubernetes.io/part-of</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ingress-nginx</span></span>
<span class="line"><span style="color:#F92672;">  ports</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">    - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">http</span></span>
<span class="line"><span style="color:#F92672;">      port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">80</span></span>
<span class="line"><span style="color:#F92672;">      targetPort</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">http</span></span>
<span class="line"><span style="color:#F8F8F2;">    - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">https</span></span>
<span class="line"><span style="color:#F92672;">      port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">443</span></span>
<span class="line"><span style="color:#F92672;">      targetPort</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">https</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br><span class="line-number">256</span><br><span class="line-number">257</span><br><span class="line-number">258</span><br><span class="line-number">259</span><br><span class="line-number">260</span><br><span class="line-number">261</span><br><span class="line-number">262</span><br><span class="line-number">263</span><br><span class="line-number">264</span><br><span class="line-number">265</span><br><span class="line-number">266</span><br><span class="line-number">267</span><br><span class="line-number">268</span><br><span class="line-number">269</span><br><span class="line-number">270</span><br><span class="line-number">271</span><br><span class="line-number">272</span><br><span class="line-number">273</span><br><span class="line-number">274</span><br><span class="line-number">275</span><br><span class="line-number">276</span><br><span class="line-number">277</span><br><span class="line-number">278</span><br><span class="line-number">279</span><br><span class="line-number">280</span><br><span class="line-number">281</span><br><span class="line-number">282</span><br><span class="line-number">283</span><br><span class="line-number">284</span><br><span class="line-number">285</span><br><span class="line-number">286</span><br><span class="line-number">287</span><br><span class="line-number">288</span><br><span class="line-number">289</span><br><span class="line-number">290</span><br><span class="line-number">291</span><br><span class="line-number">292</span><br><span class="line-number">293</span><br><span class="line-number">294</span><br><span class="line-number">295</span><br><span class="line-number">296</span><br><span class="line-number">297</span><br><span class="line-number">298</span><br><span class="line-number">299</span><br><span class="line-number">300</span><br><span class="line-number">301</span><br><span class="line-number">302</span><br><span class="line-number">303</span><br><span class="line-number">304</span><br><span class="line-number">305</span><br><span class="line-number">306</span><br><span class="line-number">307</span><br><span class="line-number">308</span><br><span class="line-number">309</span><br><span class="line-number">310</span><br><span class="line-number">311</span><br><span class="line-number">312</span><br><span class="line-number">313</span><br><span class="line-number">314</span><br><span class="line-number">315</span><br><span class="line-number">316</span><br><span class="line-number">317</span><br><span class="line-number">318</span><br></div></div>`,54)])])}const u=n(e,[["render",o]]);export{b as __pageData,u as default};
