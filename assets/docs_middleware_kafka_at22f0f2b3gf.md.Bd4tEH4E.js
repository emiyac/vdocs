import{_ as n,a,o as l,a3 as p}from"./chunks/framework.dRMRuUHH.js";const b=JSON.parse('{"title":"kafka集群部署","description":"","frontmatter":{"id":2302,"title":"kafka集群部署","createTime":"2024-03-27 00:01:00","category":"middleware"},"headers":[],"relativePath":"docs/middleware/kafka/at22f0f2b3gf.md","filePath":"docs/middleware/kafka/00402_kafka_cluster.md"}'),e={name:"docs/middleware/kafka/at22f0f2b3gf.md"};function o(r,s,c,F,t,i){return l(),a("div",null,[...s[0]||(s[0]=[p(`<h2 id="创建nfs存储目录" tabindex="-1">创建nfs存储目录 <a class="header-anchor" href="#创建nfs存储目录" aria-label="Permalink to “创建nfs存储目录”">​</a></h2><div class="tip custom-block"><p class="custom-block-title custom-block-title-default">TIP</p><p>😂本文为了方便部署使用了<code>nfs</code>,生产环境中请根据需求使用其它分布式存储，如<code>glusterfs</code>，<code>cephfs等</code></p></div><div class="language-shell line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#88846F;"># 安装nfs依赖</span></span>
<span class="line"><span style="color:#A6E22E;">yum</span><span style="color:#E6DB74;"> install</span><span style="color:#AE81FF;"> -y</span><span style="color:#E6DB74;"> nfs-utils</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># nfs 路径和访问配置</span></span>
<span class="line"><span style="color:#66D9EF;">echo</span><span style="color:#E6DB74;"> &quot;/workspace 192.168.10.0/24(rw,sync,no_root_squash)&quot;</span><span style="color:#F92672;"> &gt;</span><span style="color:#E6DB74;"> /etc/exports</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 启动 rpnbind 和 nfs 服务</span></span>
<span class="line"><span style="color:#A6E22E;">systemctl</span><span style="color:#E6DB74;"> enable</span><span style="color:#AE81FF;"> --now</span><span style="color:#E6DB74;"> rpcbind</span><span style="color:#E6DB74;"> nfs-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 检查可用的 nfs 服务 </span></span>
<span class="line"><span style="color:#A6E22E;">showmount</span><span style="color:#AE81FF;"> -e</span><span style="color:#AE81FF;"> 192.168.10.10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#88846F;"># 创建存储目录</span></span>
<span class="line"><span style="color:#A6E22E;">mkdir</span><span style="color:#E6DB74;"> data-zookeeper-{0..2}</span><span style="color:#E6DB74;"> data-kafka-{0..2}</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#88846F;"># 初始化 zookeeper 集群中的节点唯一id</span></span>
<span class="line"><span style="color:#F92672;">for</span><span style="color:#F8F8F2;"> i </span><span style="color:#F92672;">in</span><span style="color:#E6DB74;"> \`</span><span style="color:#A6E22E;">seq</span><span style="color:#AE81FF;"> 0</span><span style="color:#AE81FF;"> 2</span><span style="color:#E6DB74;">\`</span><span style="color:#F8F8F2;">;</span><span style="color:#F92672;">do</span><span style="color:#F8F8F2;"> echo $i </span><span style="color:#F92672;">&gt;</span><span style="color:#F8F8F2;"> data-zookeeper-$i/myid;</span><span style="color:#F92672;">done</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><h2 id="创建存储卷" tabindex="-1">创建存储卷 <a class="header-anchor" href="#创建存储卷" aria-label="Permalink to “创建存储卷”">​</a></h2><p>⚡ <code>zookeeper</code>集群一般为3个节点，<code>kafka</code>集群的节点数大于1个就可以，存储卷的数量和服务集群节点对应</p><div class="language-yaml line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">PersistentVolume</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper-pv-0</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  storageClassName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">  capacity</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    storage</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">2Gi</span></span>
<span class="line"><span style="color:#F92672;">  nfs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    server</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">192.168.10.10</span></span>
<span class="line"><span style="color:#F92672;">    path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/workspace/data-zookeeper-0</span></span>
<span class="line"><span style="color:#F92672;">  accessModes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">    - </span><span style="color:#E6DB74;">ReadWriteMany</span></span>
<span class="line"><span style="color:#F92672;">  persistentVolumeReclaimPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Retain</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">PersistentVolume</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper-pv-1</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  storageClassName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">  capacity</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    storage</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">2Gi</span></span>
<span class="line"><span style="color:#F92672;">  nfs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    server</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">192.168.10.10</span></span>
<span class="line"><span style="color:#F92672;">    path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/workspace/data-zookeeper-1</span></span>
<span class="line"><span style="color:#F92672;">  accessModes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">    - </span><span style="color:#E6DB74;">ReadWriteMany</span></span>
<span class="line"><span style="color:#F92672;">  persistentVolumeReclaimPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Retain</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">PersistentVolume</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper-pv-2</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  storageClassName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">  capacity</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    storage</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">2Gi</span></span>
<span class="line"><span style="color:#F92672;">  nfs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    server</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">192.168.10.10</span></span>
<span class="line"><span style="color:#F92672;">    path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/workspace/data-zookeeper-2</span></span>
<span class="line"><span style="color:#F92672;">  accessModes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">    - </span><span style="color:#E6DB74;">ReadWriteMany</span></span>
<span class="line"><span style="color:#F92672;">  persistentVolumeReclaimPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Retain</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">PersistentVolume</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka-pv-0</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  storageClassName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">  capacity</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    storage</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">2Gi</span></span>
<span class="line"><span style="color:#F92672;">  nfs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    server</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">192.168.10.10</span></span>
<span class="line"><span style="color:#F92672;">    path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/workspace/data-kafka-0</span></span>
<span class="line"><span style="color:#F92672;">  accessModes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">    - </span><span style="color:#E6DB74;">ReadWriteMany</span></span>
<span class="line"><span style="color:#F92672;">  persistentVolumeReclaimPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Retain</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">PersistentVolume</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka-pv-1</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  storageClassName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">  capacity</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    storage</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">2Gi</span></span>
<span class="line"><span style="color:#F92672;">  nfs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    server</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">192.168.10.10</span></span>
<span class="line"><span style="color:#F92672;">    path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/workspace/data-kafka-1</span></span>
<span class="line"><span style="color:#F92672;">  accessModes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">    - </span><span style="color:#E6DB74;">ReadWriteMany</span></span>
<span class="line"><span style="color:#F92672;">  persistentVolumeReclaimPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Retain</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">PersistentVolume</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka-pv-2</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  storageClassName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">  capacity</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    storage</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">2Gi</span></span>
<span class="line"><span style="color:#F92672;">  nfs</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    server</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">192.168.10.10</span></span>
<span class="line"><span style="color:#F92672;">    path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/workspace/data-kafka-2</span></span>
<span class="line"><span style="color:#F92672;">  accessModes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">    - </span><span style="color:#E6DB74;">ReadWriteMany</span></span>
<span class="line"><span style="color:#F92672;">  persistentVolumeReclaimPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Retain</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br></div></div><h2 id="部署zookeeper集群" tabindex="-1">部署zookeeper集群 <a class="header-anchor" href="#部署zookeeper集群" aria-label="Permalink to “部署zookeeper集群”">​</a></h2><p>⚡ <code>zookeeper</code>集群中的节点需要按照节点的<code>id</code>顺序来启动</p><div class="language-yaml line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Service</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  creationTimestamp</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">null</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper-headless</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper-headless</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  clusterIP</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">None</span></span>
<span class="line"><span style="color:#F92672;">  ports</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">client</span></span>
<span class="line"><span style="color:#F92672;">    port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">2181</span></span>
<span class="line"><span style="color:#F92672;">    targetPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">2181</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">server</span></span>
<span class="line"><span style="color:#F92672;">    port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">2888</span></span>
<span class="line"><span style="color:#F92672;">    targetPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">2888</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">leader-election</span></span>
<span class="line"><span style="color:#F92672;">    port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">3888</span></span>
<span class="line"><span style="color:#F92672;">    targetPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">3888</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">  type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterIP</span></span>
<span class="line"><span style="color:#F92672;">status</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  loadBalancer</span><span style="color:#F8F8F2;">: {}</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Service</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  creationTimestamp</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">null</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper-access</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper-access</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  ports</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">client</span></span>
<span class="line"><span style="color:#F92672;">    port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">2181</span></span>
<span class="line"><span style="color:#F92672;">    targetPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">2181</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">  type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">NodePort</span></span>
<span class="line"><span style="color:#F92672;">status</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  loadBalancer</span><span style="color:#F8F8F2;">: {}</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">policy/v1beta1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">PodDisruptionBudget</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper-pdb</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    matchLabels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">  maxUnavailable</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">1</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apps/v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">StatefulSet</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  creationTimestamp</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">null</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  serviceName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper-headless</span></span>
<span class="line"><span style="color:#F92672;">  replicas</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">3</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    matchLabels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">  template</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      creationTimestamp</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">null</span></span>
<span class="line"><span style="color:#F92672;">      labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">    spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      affinity</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        podAntiAffinity</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">          requiredDuringSchedulingIgnoredDuringExecution</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">          - </span><span style="color:#F92672;">labelSelector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">              matchExpressions</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">              - </span><span style="color:#F92672;">key</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">app</span></span>
<span class="line"><span style="color:#F92672;">                operator</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">In</span></span>
<span class="line"><span style="color:#F92672;">                values</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">                - </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">            topologyKey</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kubernetes.io/hostname</span></span>
<span class="line"><span style="color:#F92672;">      containers</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#F92672;">image</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">harbor.example.com/emiya/zookeeper:3.5.5</span></span>
<span class="line"><span style="color:#F92672;">        name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">        ports</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">client</span></span>
<span class="line"><span style="color:#F92672;">          containerPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">2181</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">server</span></span>
<span class="line"><span style="color:#F92672;">          containerPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">2888</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">leader-election</span></span>
<span class="line"><span style="color:#F92672;">          containerPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">3888</span></span>
<span class="line"><span style="color:#F92672;">        env</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ZOO_SERVERS</span></span>
<span class="line"><span style="color:#F92672;">          value</span><span style="color:#F8F8F2;">: </span><span style="color:#F92672;">|</span></span>
<span class="line"><span style="color:#E6DB74;">            server.0=zookeeper-0.zookeeper-headless:2888:3888;2181</span></span>
<span class="line"><span style="color:#E6DB74;">            server.1=zookeeper-1.zookeeper-headless:2888:3888;2181</span></span>
<span class="line"><span style="color:#E6DB74;">            server.2=zookeeper-2.zookeeper-headless:2888:3888;2181</span></span>
<span class="line"><span style="color:#F92672;">        volumeMounts</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">localtime</span></span>
<span class="line"><span style="color:#F92672;">          mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/etc/localtime</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">data</span></span>
<span class="line"><span style="color:#F92672;">          mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/data</span></span>
<span class="line"><span style="color:#F92672;">        resources</span><span style="color:#F8F8F2;">: {}</span></span>
<span class="line"><span style="color:#F92672;">      volumes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">localtime</span></span>
<span class="line"><span style="color:#F92672;">        hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">          path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/etc/localtime</span></span>
<span class="line"><span style="color:#F92672;">  volumeClaimTemplates</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">data</span></span>
<span class="line"><span style="color:#F92672;">    spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        matchLabels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">          app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">      accessModes</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;ReadWriteMany&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">      storageClassName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zookeeper</span></span>
<span class="line"><span style="color:#F92672;">      resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        requests</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">          storage</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">2G</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br></div></div><h2 id="部署kafka集群" tabindex="-1">部署kafka集群 <a class="header-anchor" href="#部署kafka集群" aria-label="Permalink to “部署kafka集群”">​</a></h2><p>⚡ <code>kafka</code>集群的节点启动没有顺序要求，可以设置启动策略来减少<code>kafka</code>集群的启动时间；本次示例中使用的<code>kafka</code>镜像需要指定用户为<code>root</code>以避免修改存储目录的权限；本次示例中通过修改容器默认的启动参数来设置<code>kafka</code>每个节点的唯一<code>id</code></p><div class="language-yaml line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Service</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  creationTimestamp</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">null</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka-headless</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka-headless</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  clusterIP</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">None</span></span>
<span class="line"><span style="color:#F92672;">  ports</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">internal</span></span>
<span class="line"><span style="color:#F92672;">    port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">9092</span></span>
<span class="line"><span style="color:#F92672;">    targetPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">9092</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">external</span></span>
<span class="line"><span style="color:#F92672;">    port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">9093</span></span>
<span class="line"><span style="color:#F92672;">    targetPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">9092</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">  type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ClusterIP</span></span>
<span class="line"><span style="color:#F92672;">status</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  loadBalancer</span><span style="color:#F8F8F2;">: {}</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Service</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  creationTimestamp</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">null</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka-access</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka-access</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  ports</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">external</span></span>
<span class="line"><span style="color:#F92672;">    port</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">9093</span></span>
<span class="line"><span style="color:#F92672;">    targetPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">9093</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">  type</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">NodePort</span></span>
<span class="line"><span style="color:#F92672;">status</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  loadBalancer</span><span style="color:#F8F8F2;">: {}</span></span>
<span class="line"><span style="color:#F8F8F2;">---</span></span>
<span class="line"><span style="color:#F92672;">apiVersion</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">apps/v1</span></span>
<span class="line"><span style="color:#F92672;">kind</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">StatefulSet</span></span>
<span class="line"><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  creationTimestamp</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">null</span></span>
<span class="line"><span style="color:#F92672;">  labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">  name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  serviceName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka-headless</span></span>
<span class="line"><span style="color:#F92672;">  podManagementPolicy</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">Parallel</span></span>
<span class="line"><span style="color:#F92672;">  replicas</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">3</span></span>
<span class="line"><span style="color:#F92672;">  selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    matchLabels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">  template</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      creationTimestamp</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">null</span></span>
<span class="line"><span style="color:#F92672;">      labels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">    spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      affinity</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        podAntiAffinity</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">          requiredDuringSchedulingIgnoredDuringExecution</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">          - </span><span style="color:#F92672;">labelSelector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">              matchExpressions</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">              - </span><span style="color:#F92672;">key</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">app</span></span>
<span class="line"><span style="color:#F92672;">                operator</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">In</span></span>
<span class="line"><span style="color:#F92672;">                values</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">                - </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">            topologyKey</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kubernetes.io/hostname</span></span>
<span class="line"><span style="color:#F92672;">      containers</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#F92672;">image</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">harbor.example.com/emiya/kafka:3.0.0</span></span>
<span class="line"><span style="color:#F92672;">        name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">        ports</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">internal</span></span>
<span class="line"><span style="color:#F92672;">          containerPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">9092</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">external</span></span>
<span class="line"><span style="color:#F92672;">          containerPort</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">9093</span></span>
<span class="line"><span style="color:#F92672;">        env</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">ALLOW_PLAINTEXT_LISTENER</span></span>
<span class="line"><span style="color:#F92672;">          value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;yes&quot;</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">KAFKA_CFG_INTER_BROKER_LISTENER_NAME</span></span>
<span class="line"><span style="color:#F92672;">          value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;INTERNAL&quot;</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP&quot;</span></span>
<span class="line"><span style="color:#F92672;">          value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;KAFKA_CFG_LISTENERS&quot;</span></span>
<span class="line"><span style="color:#F92672;">          value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;INTERNAL://:9092,EXTERNAL://:9093&quot;</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">KAFKA_CFG_ADVERTISED_LISTENERS</span></span>
<span class="line"><span style="color:#F92672;">          value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;INTERNAL://:9092,EXTERNAL://:9093&quot;</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">KAFKA_CFG_ZOOKEEPER_CONNECT</span></span>
<span class="line"><span style="color:#F92672;">          value</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;zookeeper-0.zookeeper-headless:2181,zookeeper-1.zookeeper-headless:2181,zookeeper-2.zookeeper-headless:2181&quot;</span></span>
<span class="line"><span style="color:#F92672;">        volumeMounts</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">localtime</span></span>
<span class="line"><span style="color:#F92672;">          mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/etc/localtime</span></span>
<span class="line"><span style="color:#F8F8F2;">        - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">data</span></span>
<span class="line"><span style="color:#F92672;">          mountPath</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/bitnami/kafka/data</span></span>
<span class="line"><span style="color:#F92672;">        securityContext</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">          runAsUser</span><span style="color:#F8F8F2;">: </span><span style="color:#AE81FF;">0</span></span>
<span class="line"><span style="color:#F92672;">        command</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;sh&quot;</span><span style="color:#F8F8F2;">, </span><span style="color:#E6DB74;">&quot;-c&quot;</span><span style="color:#F8F8F2;">, </span><span style="color:#E6DB74;">&quot;export KAFKA_CFG_BROKER_ID=\${HOSTNAME##*-} &amp;&amp; /opt/bitnami/scripts/kafka/entrypoint.sh /opt/bitnami/scripts/kafka/run.sh&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">        resources</span><span style="color:#F8F8F2;">: {}</span></span>
<span class="line"><span style="color:#F92672;">      volumes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#F92672;">name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">localtime</span></span>
<span class="line"><span style="color:#F92672;">        hostPath</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">          path</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">/etc/localtime</span></span>
<span class="line"><span style="color:#F92672;">  volumeClaimTemplates</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">  - </span><span style="color:#F92672;">metadata</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">data</span></span>
<span class="line"><span style="color:#F92672;">    spec</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      selector</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        matchLabels</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">          app</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">      accessModes</span><span style="color:#F8F8F2;">: [</span><span style="color:#E6DB74;">&quot;ReadWriteMany&quot;</span><span style="color:#F8F8F2;">]</span></span>
<span class="line"><span style="color:#F92672;">      storageClassName</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">kafka</span></span>
<span class="line"><span style="color:#F92672;">      resources</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        requests</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">          storage</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">2G</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br></div></div>`,12)])])}const m=n(e,[["render",o]]);export{b as __pageData,m as default};
